package tweets

import (
	"context"
	"encoding/base64"
	"fmt"
	"strings"

	cloudkms "cloud.google.com/go/kms/apiv1"
	"google.golang.org/api/option"
	"google.golang.org/genproto/googleapis/cloud/kms/v1"
	"gopkg.in/auth0.v3/management"

	"github.com/mjm/courier-js/internal/secret"
	"github.com/mjm/courier-js/internal/trace"
)

type UserRepository struct {
	management *management.Management
	kms        *cloudkms.KeyManagementClient
	keyID      string
}

func NewUserRepository(m *management.Management, kms *cloudkms.KeyManagementClient, cfg secret.GCPConfig) *UserRepository {
	return &UserRepository{
		management: m,
		kms:        kms,
		keyID:      fmt.Sprintf("projects/%s/locations/global/keyRings/keys/cryptoKeys/micropub-token", cfg.ProjectID),
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
	ctx = trace.Start(ctx, "Get Micropub token")
	defer trace.Finish(ctx)

	trace.UserID(ctx, userID)
	trace.AddField(ctx, "micropub.url", url)

	user, err := r.management.User.Read(userID)
	if err != nil {
		trace.Error(ctx, err)
		return "", err
	}

	if user.UserMetadata == nil {
		trace.AddField(ctx, "user.has_metadata", false)
		return "", nil
	}
	trace.AddField(ctx, "user.has_metadata", true)

	tokens, ok := user.UserMetadata["micropub_tokens"].(map[string]interface{})
	if !ok {
		return "", nil
	}

	trace.AddField(ctx, "micropub.token_count", len(tokens))

	url = strings.ReplaceAll(url, ".", "-")
	trace.AddField(ctx, "micropub.token_key", url)

	encToken, ok := tokens[url].(string)
	if !ok {
		return "", nil
	}

	trace.AddField(ctx, "micropub.encrypted_token_length", len(encToken))

	token, err := r.decryptToken(ctx, encToken)
	if err != nil {
		trace.Error(ctx, err)
		return "", err
	}

	trace.AddField(ctx, "micropub.decrypted_token_length", len(token))
	return token, nil
}

func (r *UserRepository) decryptToken(ctx context.Context, encString string) (string, error) {
	encData, err := base64.URLEncoding.DecodeString(encString)
	if err != nil {
		return "", err
	}

	res, err := r.kms.Decrypt(ctx, &kms.DecryptRequest{
		Name:       r.keyID,
		Ciphertext: encData,
	})
	if err != nil {
		return "", err
	}

	return string(res.Plaintext), nil
}

func (r *UserRepository) SetMicropubToken(ctx context.Context, userID string, url string, token string) error {
	ctx = trace.Start(ctx, "Set Micropub token")
	defer trace.Finish(ctx)

	trace.UserID(ctx, userID)
	trace.AddField(ctx, "micropub.url", url)
	trace.AddField(ctx, "micropub.decrypted_token_length", len(token))

	encToken, err := r.encryptToken(ctx, token)
	if err != nil {
		trace.Error(ctx, err)
		return err
	}

	trace.AddField(ctx, "micropub.encrypted_token_length", len(encToken))

	user, err := r.management.User.Read(userID)
	if err != nil {
		trace.Error(ctx, err)
		return err
	}

	url = strings.ReplaceAll(url, ".", "-")
	trace.AddField(ctx, "micropub.token_key", url)

	newTokens := make(map[string]interface{})
	if user.UserMetadata != nil {
		if existingTokens, ok := user.UserMetadata["micropub_tokens"].(map[string]interface{}); ok {
			for k, v := range existingTokens {
				newTokens[k] = v
			}
		}
	}
	newTokens[url] = encToken

	trace.AddField(ctx, "micropub.token_count", len(newTokens))

	if err := r.management.User.Update(userID, &management.User{
		UserMetadata: map[string]interface{}{
			"micropub_tokens": newTokens,
		},
	}); err != nil {
		trace.Error(ctx, err)
		return err
	}

	return nil
}

func (r *UserRepository) encryptToken(ctx context.Context, plainString string) (string, error) {
	res, err := r.kms.Encrypt(ctx, &kms.EncryptRequest{
		Name:      r.keyID,
		Plaintext: []byte(plainString),
	})
	if err != nil {
		return "", err
	}

	return base64.URLEncoding.EncodeToString(res.Ciphertext), nil
}
