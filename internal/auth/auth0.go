package auth

import (
	"gopkg.in/auth0.v3/management"
)

func NewManagementClient(cfg Config) (*management.Management, error) {
	return management.New(cfg.AuthDomain, cfg.ClientID, cfg.ClientSecret)
}
