package auth

import (
	"context"
	"crypto/rsa"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"gopkg.in/dgrijalva/jwt-go.v3"

	"github.com/mjm/courier-js/internal/trace"
)

var (
	// ErrNoMatchingKid is returned when there are no keys in the key set that match the ID
	// found in the token header.
	ErrNoMatchingKid = errors.New("no key with kid matching token")
	// ErrNoX509 is returned when the key that matches the token does not contain an "x5c"
	// key with the public key.
	ErrNoX509 = errors.New("no x.509 data in matched key")
)

// JWKSClient fetches signing keys in JSON Web Key Set format and finds a public key that
// matches a JWT token's key.
type JWKSClient struct {
	AuthDomain string
}

func (c *JWKSClient) SigningKey(ctx context.Context, token *jwt.Token) (*rsa.PublicKey, error) {
	ctx = trace.Start(ctx, "Get signing key")
	defer trace.Finish(ctx)

	url := fmt.Sprintf("https://%s/.well-known/jwks.json", c.AuthDomain)
	trace.AddField(ctx, "url", url)

	resp, err := http.Get(url)
	if err != nil {
		trace.Error(ctx, err)
		return nil, err
	}
	defer resp.Body.Close()

	var keySet jsonWebKeySet
	if err := json.NewDecoder(resp.Body).Decode(&keySet); err != nil {
		trace.Error(ctx, err)
		return nil, err
	}

	trace.AddField(ctx, "key_count", len(keySet.Keys))

	for _, key := range keySet.Keys {
		if token.Header["kid"] == key.KID {
			key, err := extractPublicKey(key)
			if err != nil {
				trace.Error(ctx, err)
				return nil, err
			}

			return key, nil
		}
	}

	trace.Error(ctx, ErrNoMatchingKid)
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
