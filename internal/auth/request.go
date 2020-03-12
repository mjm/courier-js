package auth

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"github.com/google/wire"
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"
	"gopkg.in/auth0.v3/management"
	"gopkg.in/dgrijalva/jwt-go.v3"
)

var DefaultSet = wire.NewSet(NewAuthenticator, NewConfig, NewManagementClient, NewJWKSClient)

type userContextKey struct{}

var tracer = global.TraceProvider().Tracer("courier.blog/internal/auth")

var (
	authDomainKey    = key.New("auth_domain")
	apiIdentifierKey = key.New("auth.api_identifier")
	tokenPresentKey  = key.New("auth.token_present")
)

// Authenticator is responsible for populating a context with a User that can be used by
// resolvers and other downstream logic.
type Authenticator struct {
	Config
	management *management.Management
	jwks       *JWKSClient
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
	ctx, span := tracer.Start(parentCtx, "Authenticate",
		trace.WithAttributes(
			authDomainKey.String(a.AuthDomain),
			apiIdentifierKey.String(a.APIIdentifier)))
	defer span.End()

	tokenStr := getTokenString(r)
	if tokenStr == "" {
		span.SetAttributes(tokenPresentKey.Bool(false))
		return context.WithValue(parentCtx, userContextKey{}, AnonymousUser{}), nil
	}

	span.SetAttributes(tokenPresentKey.Bool(true))

	claims := Claims{
		Expectations: a.Config.ClaimsExpectations(),
	}
	token, err := jwt.ParseWithClaims(tokenStr, &claims, func(token *jwt.Token) (interface{}, error) {
		return a.jwks.SigningKey(ctx, token)
	})

	if err != nil {
		span.RecordError(ctx, err)
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

	if c, err := r.Cookie("accessToken"); err == nil {
		return c.Value
	}

	return ""
}
