package billing

import (
	"context"

	"github.com/stripe/stripe-go"
	"github.com/stripe/stripe-go/client"
	"go.opentelemetry.io/otel/api/trace"
)

type SubscriptionRepository struct {
	stripe *client.API
}

func NewSubscriptionRepository(stripe *client.API) *SubscriptionRepository {
	return &SubscriptionRepository{stripe: stripe}
}

func (r *SubscriptionRepository) Get(ctx context.Context, id string) (*stripe.Subscription, error) {
	ctx, span := tracer.Start(ctx, "SubscriptionRepository.Get",
		trace.WithAttributes(subscriptionIDKey(id)))
	defer span.End()

	sub, err := r.stripe.Subscriptions.Get(id, nil)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	return sub, nil
}

func (r *SubscriptionRepository) Create(ctx context.Context, cusID string, planID string) (string, error) {
	ctx, span := tracer.Start(ctx, "SubscriptionRepository.Create",
		trace.WithAttributes(
			customerIDKey(cusID),
			planIDKey(planID)))
	defer span.End()

	sub, err := r.stripe.Subscriptions.New(&stripe.SubscriptionParams{
		Customer: &cusID,
		Items: []*stripe.SubscriptionItemsParams{
			{Plan: &planID},
		},
	})
	if err != nil {
		span.RecordError(ctx, err)
		return "", err
	}

	span.SetAttributes(subscriptionIDKey(sub.ID))
	return sub.ID, nil
}

func (r *SubscriptionRepository) Uncancel(ctx context.Context, subID string) error {
	ctx, span := tracer.Start(ctx, "SubscriptionRepository.Uncancel",
		trace.WithAttributes(subscriptionIDKey(subID)))
	defer span.End()

	if _, err := r.stripe.Subscriptions.Update(subID, &stripe.SubscriptionParams{
		CancelAtPeriodEnd: stripe.Bool(false),
	}); err != nil {
		span.RecordError(ctx, err)
		return err
	}

	return nil
}

func (r *SubscriptionRepository) CancelLater(ctx context.Context, subID string) error {
	ctx, span := tracer.Start(ctx, "SubscriptionRepository.CancelLater",
		trace.WithAttributes(subscriptionIDKey(subID)))
	defer span.End()

	if _, err := r.stripe.Subscriptions.Update(subID, &stripe.SubscriptionParams{
		CancelAtPeriodEnd: stripe.Bool(true),
	}); err != nil {
		span.RecordError(ctx, err)
		return err
	}

	return nil
}

func (r *SubscriptionRepository) CancelNow(ctx context.Context, subID string) error {
	ctx, span := tracer.Start(ctx, "SubscriptionRepository.CancelNow",
		trace.WithAttributes(subscriptionIDKey(subID)))
	defer span.End()

	if _, err := r.stripe.Subscriptions.Cancel(subID, nil); err != nil {
		span.RecordError(ctx, err)
		return err
	}

	return nil
}
