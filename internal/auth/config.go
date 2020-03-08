package auth

import (
	"context"

	"github.com/mjm/courier-js/internal/config"
)

type Config struct {
	AuthDomain   string `env:"AUTH_DOMAIN"`
	ClientID     string `env:"BACKEND_CLIENT_ID"`
	ClientSecret string `secret:"auth0-backend-secret"`
}

func NewConfig(l *config.Loader) (cfg Config, err error) {
	err = l.Load(context.Background(), &cfg)
	return
}
