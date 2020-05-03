package billing

import (
	"context"

	"github.com/google/wire"
	"github.com/stripe/stripe-go/client"

	"github.com/mjm/courier-js/internal/config"
)

var DefaultSet = wire.NewSet(NewConfig, NewClient)

// Config includes settings for configuring talking to Stripe for billing.
type Config struct {
	SecretKey     string `secret:"stripe/secret-key"`
	WebhookSecret string `env:"STRIPE_WEBHOOK_SECRET" secret:"stripe/webhook-secret"`
	MonthlyPlanID string `env:"MONTHLY_PLAN_ID" secret:"stripe/monthly-plan-id"`
}

// NewClient creates a new Stripe client from a billing config.
func NewClient(cfg Config) *client.API {
	return client.New(cfg.SecretKey, nil)
}

func NewConfig(l *config.Loader) (cfg Config, err error) {
	err = l.Load(context.Background(), &cfg)
	return
}
