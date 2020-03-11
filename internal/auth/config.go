package auth

import (
	"context"

	"github.com/mjm/courier-js/internal/config"
)

type Config struct {
	AuthDomain    string `env:"AUTH_DOMAIN"`
	APIIdentifier string `env:"API_IDENTIFIER"`
	ClientID      string `env:"BACKEND_CLIENT_ID"`
	ClientSecret  string `secret:"auth0-backend-secret"`
}

func NewConfig(l *config.Loader) (cfg Config, err error) {
	err = l.Load(context.Background(), &cfg)
	return
}

func (c Config) ClaimsExpectations() ClaimsExpectations {
	return ClaimsExpectations{
		AuthDomain:    c.AuthDomain,
		APIIdentifier: c.APIIdentifier,
	}
}
