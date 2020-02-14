package billing

import (
	"context"

	"github.com/stripe/stripe-go"
	"github.com/stripe/stripe-go/client"

	"github.com/mjm/courier-js/internal/trace"
)

type SubscriptionRepository struct {
	stripe *client.API
}

func NewSubscriptionRepository(stripe *client.API) *SubscriptionRepository {
	return &SubscriptionRepository{stripe: stripe}
}

func (r *SubscriptionRepository) Get(ctx context.Context, id string) (*stripe.Subscription, error) {
	ctx = trace.Start(ctx, "Stripe: Get subscription")
	defer trace.Finish(ctx)

	trace.AddField(ctx, "stripe.subscription_id", id)

	sub, err := r.stripe.Subscriptions.Get(id, nil)
	if err != nil {
		trace.Error(ctx, err)
		return nil, err
	}

	return sub, nil
}

func (r *SubscriptionRepository) Create(ctx context.Context, cusID string, planID string) (string, error) {
	ctx = trace.Start(ctx, "Stripe: Create subscription")
	defer trace.Finish(ctx)

	trace.Add(ctx, trace.Fields{
		"stripe.customer_id": cusID,
		"stripe.plan_id":     planID,
	})

	sub, err := r.stripe.Subscriptions.New(&stripe.SubscriptionParams{
		Customer: &cusID,
		Items: []*stripe.SubscriptionItemsParams{
			{Plan: &planID},
		},
	})
	if err != nil {
		trace.Error(ctx, err)
		return "", err
	}

	trace.AddField(ctx, "stripe.subscription_id", sub.ID)
	return sub.ID, nil
}

func (r *SubscriptionRepository) Uncancel(ctx context.Context, subID string) error {
	ctx = trace.Start(ctx, "Stripe: Uncancel subscription")
	defer trace.Finish(ctx)

	trace.Add(ctx, trace.Fields{
		"stripe.subscription_id": subID,
	})

	if _, err := r.stripe.Subscriptions.Update(subID, &stripe.SubscriptionParams{
		CancelAtPeriodEnd: stripe.Bool(false),
	}); err != nil {
		trace.Error(ctx, err)
		return err
	}

	return nil
}

func (r *SubscriptionRepository) CancelLater(ctx context.Context, subID string) error {
	ctx = trace.Start(ctx, "Stripe: Cancel subscription")
	defer trace.Finish(ctx)

	trace.Add(ctx, trace.Fields{
		"stripe.subscription_id": subID,
		"stripe.cancel_now":      false,
	})
	if _, err := r.stripe.Subscriptions.Update(subID, &stripe.SubscriptionParams{
		CancelAtPeriodEnd: stripe.Bool(true),
	}); err != nil {
		trace.Error(ctx, err)
		return err
	}

	return nil
}

func (r *SubscriptionRepository) CancelNow(ctx context.Context, subID string) error {
	ctx = trace.Start(ctx, "Stripe: Cancel subscription")
	defer trace.Finish(ctx)

	trace.Add(ctx, trace.Fields{
		"stripe.subscription_id": subID,
		"stripe.cancel_now":      true,
	})

	if _, err := r.stripe.Subscriptions.Cancel(subID, nil); err != nil {
		trace.Error(ctx, err)
		return err
	}

	return nil
}
