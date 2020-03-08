package billing

import (
	"context"
	"os"

	"github.com/google/wire"
	"github.com/stripe/stripe-go/client"

	"github.com/mjm/courier-js/internal/config"
	"github.com/mjm/courier-js/internal/secret"
)

var DefaultSet = wire.NewSet(NewConfig, NewClient)

// Config includes settings for configuring talking to Stripe for billing.
type Config struct {
	SecretKey     string `secret:"stripe-secret-key"`
	WebhookSecret string `env:"STRIPE_WEBHOOK_SECRET" secret:"stripe-webhook-secret"`
	MonthlyPlanID string `env:"MONTHLY_PLAN_ID"`
}

// NewClient creates a new Stripe client from a billing config.
func NewClient(cfg Config) *client.API {
	return client.New(cfg.SecretKey, nil)
}

func NewConfig(l *config.Loader) (cfg Config, err error) {
	err = l.Load(context.Background(), &cfg)
	return
}

func NewConfigFromSecrets(sk secret.Keeper) (cfg Config, err error) {
	cfg.SecretKey, err = sk.GetSecret(context.Background(), "stripe-secret-key")
	if err != nil {
		return
	}

	cfg.WebhookSecret = os.Getenv("STRIPE_WEBHOOK_SECRET")
	if cfg.WebhookSecret == "" {
		cfg.WebhookSecret, err = sk.GetSecret(context.Background(), "stripe-webhook-secret")
		if err != nil {
			return
		}
	}

	cfg.MonthlyPlanID = os.Getenv("MONTHLY_PLAN_ID")
	return
}
