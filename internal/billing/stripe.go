package billing

import (
	"context"
	"os"

	"github.com/stripe/stripe-go/client"

	"github.com/mjm/courier-js/internal/secret"
)

// Config includes settings for configuring talking to Stripe for billing.
type Config struct {
	SecretKey     string
	WebhookSecret string
	MonthlyPlanID string
}

// NewClient creates a new Stripe client from a billing config.
func NewClient(cfg Config) *client.API {
	return client.New(cfg.SecretKey, nil)
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
