package auth

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"gopkg.in/auth0.v3/management"
	"gopkg.in/dgrijalva/jwt-go.v3"

	"github.com/mjm/courier-js/internal/trace"
)

var userContextKey struct{}

// Authenticator is responsible for populating a context with a User that can be used by
// resolvers and other downstream logic.
type Authenticator struct {
	Config

	management *management.Management
}

type Config struct {
	AuthDomain   string
	ClientID     string
	ClientSecret string
}

func NewAuthenticator(cfg Config) (*Authenticator, error) {
	m, err := management.New(cfg.AuthDomain, cfg.ClientID, cfg.ClientSecret)
	if err != nil {
		return nil, err
	}

	return &Authenticator{
		Config:     cfg,
		management: m,
	}, nil
}

// Authenticate reads a JWT token from the request and returns a new context with an
// appropriate `User`.
//
// Requests that don't include a token will still get a user, but it will be anonymous.
// APIs that require a valid user should check that with the user.
func (a *Authenticator) Authenticate(parentCtx context.Context, r *http.Request) (context.Context, error) {
	ctx := trace.Start(parentCtx, "Authenticate")
	defer trace.Finish(ctx)

	trace.AddField(ctx, "auth_domain", a.AuthDomain)

	tokenStr := getTokenString(r)
	if tokenStr == "" {
		trace.AddField(ctx, "token_present", false)
		return context.WithValue(parentCtx, &userContextKey, AnonymousUser{}), nil
	}

	trace.AddField(ctx, "token_present", true)

	jwks := &JWKSClient{AuthDomain: a.AuthDomain}
	var claims Claims
	token, err := jwt.ParseWithClaims(tokenStr, &claims, func(token *jwt.Token) (interface{}, error) {
		return jwks.SigningKey(ctx, token)
	})

	if err != nil {
		trace.Error(ctx, err)
		return parentCtx, fmt.Errorf("invalid token: %w", err)
	}
	return context.WithValue(parentCtx, &userContextKey, &TokenUser{
		token:         token,
		authenticator: a,
	}), nil
}

// GetUser retrieves the user for the current request from the context.
func GetUser(ctx context.Context) User {
	u := ctx.Value(&userContextKey)
	if u == nil {
		return nil
	}

	return u.(User)
}

func getTokenString(r *http.Request) string {
	authz := r.Header.Get("Authorization")
	if authz != "" && strings.HasPrefix(authz, "Bearer ") {
		return authz[7:]
	}

	// TODO consider supporting cookies

	return ""
}
