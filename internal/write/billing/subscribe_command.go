package billing

import (
	"context"
	"fmt"

	"github.com/stripe/stripe-go"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/shared/billing"
	"github.com/mjm/courier-js/internal/trace"
)

type SubscribeCommand struct {
	UserID  string
	TokenID string
	Email   string
}

func (h *CommandHandler) handleSubscribe(ctx context.Context, cmd SubscribeCommand) error {
	createNewCustomer := cmd.Email != "" && cmd.TokenID != ""
	trace.AddField(ctx, "billing.create_new_customer", createNewCustomer)

	sub, err := h.getExistingSubscription(ctx)
	if err != nil {
		return err
	}
	trace.AddField(ctx, "billing.has_subscription", sub != nil)

	if sub != nil {
		trace.Add(ctx, trace.Fields{
			"billing.existing_subscription_id": sub.ID,
			"billing.status":                   sub.Status,
			"billing.cancel_at_period_end":     sub.CancelAtPeriodEnd,
		})

		if sub.Status == stripe.SubscriptionStatusActive {
			if sub.CancelAtPeriodEnd {
				if err := h.subRepo.Uncancel(ctx, sub.ID); err != nil {
					return err
				}
				return nil
			}

			return fmt.Errorf("cannot unsubscribe: you already have an active subscription")
		}

		if sub.Status != stripe.SubscriptionStatusCanceled {
			if err = h.subRepo.CancelNow(ctx, sub.ID); err != nil {
				return err
			}
		}
	}

	var cusID string
	if createNewCustomer {
		cusID, err = h.cusRepo.Create(ctx, cmd.Email, cmd.TokenID)
		h.eventBus.Fire(ctx, billing.CustomerCreated{
			UserID:     cmd.UserID,
			CustomerID: cusID,
		})
	} else {
		cusID, err = h.requireExistingCustomer(ctx)
	}
	if err != nil {
		return err
	}

	trace.CustomerID(ctx, cusID)

	subID, err := h.subRepo.Create(ctx, cusID, h.config.MonthlyPlanID)
	if err != nil {
		return err
	}

	trace.SubscriptionID(ctx, subID)
	h.eventBus.Fire(ctx, billing.SubscriptionCreated{
		UserID:         cmd.UserID,
		SubscriptionID: subID,
	})

	return nil
}

func (h *CommandHandler) getExistingSubscription(ctx context.Context) (*stripe.Subscription, error) {
	subID := auth.GetUser(ctx).SubscriptionID()
	if subID == "" {
		return nil, nil
	}

	return h.subRepo.Get(ctx, subID)
}

func (h *CommandHandler) requireExistingCustomer(ctx context.Context) (string, error) {
	cusID := auth.GetUser(ctx).CustomerID()
	if cusID == "" {
		return "", fmt.Errorf("no existing payment method to subscribe with")
	}

	return cusID, nil
}
