package billing

import (
	"context"

	"github.com/graph-gophers/dataloader"
	"github.com/stripe/stripe-go"
	"github.com/stripe/stripe-go/client"

	"github.com/mjm/courier-js/internal/loader"
	"github.com/mjm/courier-js/internal/trace"
)

type SubscriptionQueries interface {
	Get(context.Context, string) (*stripe.Subscription, error)
}

type subscriptionQueries struct {
	stripe *client.API
	loader *dataloader.Loader
}

func NewSubscriptionQueries(sc *client.API) SubscriptionQueries {
	return &subscriptionQueries{
		stripe: sc,
		loader: newSubscriptionLoader(sc),
	}
}

func newSubscriptionLoader(sc *client.API) *dataloader.Loader {
	return loader.New("Subscription Loader", func(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
		results := make([]*dataloader.Result, 0, len(keys))
		for _, key := range keys {
			subscription, err := loadSubscription(ctx, sc, key.String())
			if err != nil {
				results = append(results, &dataloader.Result{Error: err})
			} else {
				results = append(results, &dataloader.Result{Data: subscription})
			}
		}
		return results
	})
}

func (q *subscriptionQueries) Get(ctx context.Context, id string) (*stripe.Subscription, error) {
	v, err := q.loader.Load(ctx, dataloader.StringKey(id))()
	if err != nil {
		return nil, err
	}
	return v.(*stripe.Subscription), nil
}

func loadSubscription(ctx context.Context, sc *client.API, id string) (*stripe.Subscription, error) {
	ctx = trace.Start(ctx, "Stripe: Get customer")
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
