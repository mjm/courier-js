package auth

import (
	"context"

	"github.com/mjm/courier-js/internal/config"
)

type Config struct {
	AuthDomain    string `secret:"auth/domain"`
	APIIdentifier string `secret:"auth/api-identifier"`
	ClientID      string `secret:"auth/backend-client-id"`
	ClientSecret  string `secret:"auth/backend-secret"`
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
