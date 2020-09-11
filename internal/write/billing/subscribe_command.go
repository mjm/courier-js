package billing

import (
	"context"
	"errors"

	"github.com/stripe/stripe-go"
	"go.opentelemetry.io/otel/api/kv"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/shared/billing"
	"github.com/mjm/courier-js/internal/trace/keys"
)

type SubscribeCommand struct {
	UserID          string
	PaymentMethodID string
	Email           string
}

var (
	newCustomerKey     = kv.Key("billing.create_new_customer").Bool
	hasSubscriptionKey = kv.Key("billing.has_subscription").Bool

	existingSubIDKey = kv.Key("billing.existing_subscription_id").String
	statusKey        = kv.Key("billing.status").String
	cancelAtEndKey   = kv.Key("billing.cancel_at_period_end").Bool
)

var (
	ErrAlreadyActive   = errors.New("cannot unsubscribe: you already have an active subscription")
	ErrNoPaymentMethod = errors.New("no existing payment method to subscribe with")
)

func (h *CommandHandler) handleSubscribe(ctx context.Context, cmd SubscribeCommand) error {
	span := trace.SpanFromContext(ctx)
	createNewCustomer := cmd.Email != "" && cmd.PaymentMethodID != ""

	span.SetAttributes(newCustomerKey(createNewCustomer))

	sub, err := h.getExistingSubscription(ctx)
	if err != nil {
		return err
	}
	span.SetAttributes(hasSubscriptionKey(sub != nil))

	if sub != nil {
		span.SetAttributes(
			existingSubIDKey(sub.ID),
			statusKey(string(sub.Status)),
			cancelAtEndKey(sub.CancelAtPeriodEnd))

		if sub.Status == stripe.SubscriptionStatusActive {
			if sub.CancelAtPeriodEnd {
				if err := h.subRepo.Uncancel(ctx, sub.ID); err != nil {
					return err
				}
				return nil
			}

			return ErrAlreadyActive
		}

		if sub.Status != stripe.SubscriptionStatusCanceled {
			if err = h.subRepo.CancelNow(ctx, sub.ID); err != nil {
				return err
			}
		}
	}

	var cusID string
	if createNewCustomer {
		cusID, err = h.cusRepo.CreateWithPaymentMethod(ctx, cmd.Email, cmd.PaymentMethodID)
		h.events.Fire(ctx, billing.CustomerCreated{
			UserId:     cmd.UserID,
			CustomerId: cusID,
		})
	} else {
		cusID, err = h.requireExistingCustomer(ctx)
	}
	if err != nil {
		return err
	}

	span.SetAttributes(keys.CustomerID(cusID))

	subID, err := h.subRepo.Create(ctx, cusID, h.config.MonthlyPlanID)
	if err != nil {
		return err
	}

	span.SetAttributes(keys.SubscriptionID(subID))
	h.events.Fire(ctx, billing.SubscriptionCreated{
		UserId:         cmd.UserID,
		SubscriptionId: subID,
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
		return "", ErrNoPaymentMethod
	}

	return cusID, nil
}
