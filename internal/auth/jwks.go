package auth

import (
	"context"
	"crypto/rsa"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"go.opentelemetry.io/otel/api/key"
	"gopkg.in/dgrijalva/jwt-go.v3"
)

var (
	// ErrNoMatchingKid is returned when there are no keys in the key set that match the ID
	// found in the token header.
	ErrNoMatchingKid = errors.New("no key with kid matching token")
	// ErrNoX509 is returned when the key that matches the token does not contain an "x5c"
	// key with the public key.
	ErrNoX509 = errors.New("no x.509 data in matched key")
)

var (
	urlKey      = key.New("url")
	keyCountKey = key.New("jwks.key_count")
)

// JWKSClient fetches signing keys in JSON Web Key Set format and finds a public key that
// matches a JWT token's key.
type JWKSClient struct {
	AuthDomain string
}

func NewJWKSClient(cfg Config) *JWKSClient {
	return &JWKSClient{AuthDomain: cfg.AuthDomain}
}

func (c *JWKSClient) SigningKey(ctx context.Context, token *jwt.Token) (*rsa.PublicKey, error) {
	ctx, span := tracer.Start(ctx, "JWKSClient.SigningKey")
	defer span.End()

	url := fmt.Sprintf("https://%s/.well-known/jwks.json", c.AuthDomain)
	span.SetAttributes(urlKey.String(url))

	resp, err := http.Get(url)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}
	defer resp.Body.Close()

	var keySet jsonWebKeySet
	if err := json.NewDecoder(resp.Body).Decode(&keySet); err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	span.SetAttributes(keyCountKey.Int(len(keySet.Keys)))

	for _, key := range keySet.Keys {
		if token.Header["kid"] == key.KID {
			key, err := extractPublicKey(key)
			if err != nil {
				span.RecordError(ctx, err)
				return nil, err
			}

			return key, nil
		}
	}

	span.RecordError(ctx, ErrNoMatchingKid)
	return nil, ErrNoMatchingKid
}

func extractPublicKey(key jsonWebKey) (*rsa.PublicKey, error) {
	if len(key.X5C) > 0 {
		data := []byte("-----BEGIN CERTIFICATE-----\n" + key.X5C[0] + "\n-----END CERTIFICATE-----")
		return jwt.ParseRSAPublicKeyFromPEM(data)
	}

	return nil, ErrNoX509
}

type jsonWebKeySet struct {
	Keys []jsonWebKey `json:"keys"`
}

type jsonWebKey struct {
	Alg string   `json:"alg"`
	KID string   `json:"kid"`
	Mod string   `json:"n"`
	Exp string   `json:"e"`
	X5C []string `json:"x5c"`
}
