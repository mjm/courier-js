package billing

import (
	"context"

	"github.com/graph-gophers/dataloader"
	"github.com/mjm/courier-js/internal/loader"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/stripe/stripe-go"
	"github.com/stripe/stripe-go/client"
)

// SubscriptionLoader loads subscription data from Stripe.
type SubscriptionLoader struct {
	*dataloader.Loader
}

// NewSubscriptionLoader creates a new subscription loader using a Stripe API client.
func NewSubscriptionLoader(sc *client.API) SubscriptionLoader {
	return SubscriptionLoader{
		loader.New("Subscription Loader", func(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
			results := make([]*dataloader.Result, 0, len(keys))
			for _, key := range keys {
				sub, err := loadSubscription(ctx, sc, key.String())
				if err != nil {
					results = append(results, &dataloader.Result{Error: err})
				} else {
					results = append(results, &dataloader.Result{Data: sub})
				}
			}
			return results
		}),
	}
}

func loadSubscription(ctx context.Context, sc *client.API, id string) (*stripe.Subscription, error) {
	ctx = trace.Start(ctx, "Stripe: Get subscription")
	defer trace.Finish(ctx)

	trace.Add(ctx, trace.Fields{
		"stripe.subscription_id": id,
	})

	sub, err := sc.Subscriptions.Get(id, &stripe.SubscriptionParams{})
	if err != nil {
		trace.Error(ctx, err)
		return nil, err
	}

	return sub, nil
}
