package billing

import (
	"github.com/stripe/stripe-go/client"
)

// Config includes settings for configuring talking to Stripe for billing.
type Config struct {
	SecretKey     string
	MonthlyPlanID string
}

// NewClient creates a new Stripe client from a billing config.
func NewClient(cfg Config) *client.API {
	return client.New(cfg.SecretKey, nil)
}
