package auth

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"github.com/google/wire"
	"gopkg.in/auth0.v3/management"
	"gopkg.in/dgrijalva/jwt-go.v3"

	"github.com/mjm/courier-js/internal/trace"
)

var DefaultSet = wire.NewSet(NewAuthenticator, NewManagementClient, NewJWKSClient)

type userContextKey struct{}

// Authenticator is responsible for populating a context with a User that can be used by
// resolvers and other downstream logic.
type Authenticator struct {
	Config
	management *management.Management
	jwks       *JWKSClient
}

type Config struct {
	AuthDomain   string
	ClientID     string
	ClientSecret string
}

func NewAuthenticator(cfg Config, m *management.Management, jwks *JWKSClient) *Authenticator {
	return &Authenticator{
		Config:     cfg,
		management: m,
		jwks:       jwks,
	}
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
		return context.WithValue(parentCtx, userContextKey{}, AnonymousUser{}), nil
	}

	trace.AddField(ctx, "token_present", true)

	var claims Claims
	token, err := jwt.ParseWithClaims(tokenStr, &claims, func(token *jwt.Token) (interface{}, error) {
		return a.jwks.SigningKey(ctx, token)
	})

	if err != nil {
		trace.Error(ctx, err)
		return parentCtx, fmt.Errorf("invalid token: %w", err)
	}
	return context.WithValue(parentCtx, userContextKey{}, &TokenUser{
		token:         token,
		authenticator: a,
	}), nil
}

// GetUser retrieves the user for the current request from the context.
func GetUser(ctx context.Context) User {
	u := ctx.Value(userContextKey{})
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
