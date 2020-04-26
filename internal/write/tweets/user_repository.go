package tweets

import (
	"context"
	"encoding/base64"
	"errors"
	"strings"

	cloudkms "cloud.google.com/go/kms/apiv1"
	"github.com/stripe/stripe-go"
	"github.com/stripe/stripe-go/client"
	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"
	"google.golang.org/api/option"
	"google.golang.org/genproto/googleapis/cloud/kms/v1"
	"google.golang.org/grpc/status"
	"gopkg.in/auth0.v3/management"

	"github.com/mjm/courier-js/internal/secret"
	"github.com/mjm/courier-js/internal/trace/keys"
)

var (
	ErrSubIDNotString = errors.New("user's subscription ID is not a string")
)

var (
	hasMetadataKey = key.New("user.has_metadata").Bool
	encTokenLenKey = key.New("micropub.encrypted_token_length").Int
	decTokenLenKey = key.New("micropub.decrypted_token_length").Int
	tokenKeyKey    = key.New("micropub.token_key").String
	tokenCountKey  = key.New("micropub.token_count").Int
	keyIDKey       = key.New("kms.key_id").String
)

type UserRepository struct {
	management *management.Management
	kms        *cloudkms.KeyManagementClient
	keyID      string
	stripe     *client.API
}

func NewUserRepository(m *management.Management, stripe *client.API) *UserRepository {
	return &UserRepository{
		management: m,
		// kms:        kms,
		// keyID:      fmt.Sprintf("projects/%s/locations/global/keyRings/keys/cryptoKeys/micropub-token", cfg.ProjectID),
		stripe: stripe,
	}
}

func NewKeyManagementClient(cfg secret.GCPConfig) (*cloudkms.KeyManagementClient, error) {
	var o []option.ClientOption
	if cfg.CredentialsFile != "" {
		o = append(o, option.WithCredentialsFile(cfg.CredentialsFile))
	}
	return cloudkms.NewKeyManagementClient(context.Background(), o...)
}

func (r *UserRepository) MicropubToken(ctx context.Context, userID string, url string) (string, error) {
	ctx, span := tracer.Start(ctx, "UserRepository.MicropubToken",
		trace.WithAttributes(
			keys.UserID(userID),
			keys.FeedHomePageURL(url)))
	defer span.End()

	user, err := r.management.User.Read(userID)
	if err != nil {
		span.RecordError(ctx, err)
		return "", err
	}

	if user.UserMetadata == nil {
		span.SetAttributes(hasMetadataKey(false))
		return "", nil
	}
	span.SetAttributes(hasMetadataKey(true))

	tokens, ok := user.UserMetadata["micropub_tokens"].(map[string]interface{})
	if !ok {
		return "", nil
	}

	span.SetAttributes(tokenCountKey(len(tokens)))

	url = strings.ReplaceAll(url, ".", "-")
	span.SetAttributes(tokenKeyKey(url))

	encToken, ok := tokens[url].(string)
	if !ok {
		return "", nil
	}

	span.SetAttributes(encTokenLenKey(len(encToken)))

	token, err := r.decryptToken(ctx, encToken)
	if err != nil {
		span.RecordError(ctx, err)
		return "", err
	}

	span.SetAttributes(decTokenLenKey(len(token)))
	return token, nil
}

func (r *UserRepository) decryptToken(ctx context.Context, encString string) (string, error) {
	ctx, span := tracer.Start(ctx, "UserRepository.decryptToken",
		trace.WithAttributes(keyIDKey(r.keyID)))
	defer span.End()

	encData, err := base64.URLEncoding.DecodeString(encString)
	if err != nil {
		span.RecordError(ctx, err)
		return "", err
	}

	res, err := r.kms.Decrypt(ctx, &kms.DecryptRequest{
		Name:       r.keyID,
		Ciphertext: encData,
	})
	if err != nil {
		span.RecordError(ctx, err, trace.WithErrorStatus(status.Code(err)))
		return "", err
	}

	return string(res.Plaintext), nil
}

func (r *UserRepository) SetMicropubToken(ctx context.Context, userID string, url string, token string) error {
	ctx, span := tracer.Start(ctx, "UserRepository.SetMicropubToken",
		trace.WithAttributes(
			keys.UserID(userID),
			keys.FeedHomePageURL(url),
			decTokenLenKey(len(token))))
	defer span.End()

	encToken, err := r.encryptToken(ctx, token)
	if err != nil {
		span.RecordError(ctx, err)
		return err
	}

	span.SetAttributes(encTokenLenKey(len(encToken)))

	user, err := r.management.User.Read(userID)
	if err != nil {
		span.RecordError(ctx, err)
		return err
	}

	url = strings.ReplaceAll(url, ".", "-")
	span.SetAttributes(tokenKeyKey(url))

	newTokens := make(map[string]interface{})
	if user.UserMetadata != nil {
		if existingTokens, ok := user.UserMetadata["micropub_tokens"].(map[string]interface{}); ok {
			for k, v := range existingTokens {
				newTokens[k] = v
			}
		}
	}
	newTokens[url] = encToken

	span.SetAttributes(tokenCountKey(len(newTokens)))

	if err := r.management.User.Update(userID, &management.User{
		UserMetadata: map[string]interface{}{
			"micropub_tokens": newTokens,
		},
	}); err != nil {
		span.RecordError(ctx, err)
		return err
	}

	return nil
}

func (r *UserRepository) encryptToken(ctx context.Context, plainString string) (string, error) {
	ctx, span := tracer.Start(ctx, "UserRepository.encryptToken",
		trace.WithAttributes(keyIDKey(r.keyID)))
	defer span.End()

	res, err := r.kms.Encrypt(ctx, &kms.EncryptRequest{
		Name:      r.keyID,
		Plaintext: []byte(plainString),
	})
	if err != nil {
		span.RecordError(ctx, err, trace.WithErrorStatus(status.Code(err)))
		return "", err
	}

	return base64.URLEncoding.EncodeToString(res.Ciphertext), nil
}

func (r *UserRepository) IsSubscribed(ctx context.Context, userID string) (bool, error) {
	ctx, span := tracer.Start(ctx, "UserRepository.IsSubscribed",
		trace.WithAttributes(keys.UserID(userID)))
	defer span.End()

	user, err := r.management.User.Read(userID)
	if err != nil {
		span.RecordError(ctx, err)
		return false, err
	}

	statusOverride, ok := user.AppMetadata["subscription_status"]
	if ok && statusOverride == "active" {
		span.SetAttributes(keys.Subscribed(true))
		return true, nil
	}

	subIDValue, ok := user.AppMetadata["stripe_subscription_id"]
	if !ok {
		span.SetAttributes(keys.Subscribed(false))
		return false, nil
	}

	subID, ok := subIDValue.(string)
	if !ok {
		span.RecordError(ctx, ErrSubIDNotString)
		return false, ErrSubIDNotString
	}

	span.SetAttributes(keys.SubscriptionID(subID))

	sub, err := r.stripe.Subscriptions.Get(subID, nil)
	if err != nil {
		span.RecordError(ctx, err)
		return false, err
	}

	if sub.Status == stripe.SubscriptionStatusActive {
		span.SetAttributes(keys.Subscribed(true))
		return true, nil
	}

	span.SetAttributes(keys.Subscribed(false))
	return false, nil
}
