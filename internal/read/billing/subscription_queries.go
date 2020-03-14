package billing

import (
	"context"
	"errors"
	"fmt"

	"github.com/graph-gophers/dataloader"
	"github.com/stripe/stripe-go"
	"github.com/stripe/stripe-go/client"
	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"
	"gopkg.in/auth0.v3/management"

	"github.com/mjm/courier-js/internal/loader"
	"github.com/mjm/courier-js/internal/trace/keys"
)

var ErrNoUser = errors.New("no user found")

type SubscriptionQueries interface {
	Get(context.Context, string) (*stripe.Subscription, error)
	GetUserID(context.Context, string) (string, error)
}

type subscriptionQueries struct {
	stripe     *client.API
	management *management.Management
	loader     *dataloader.Loader
}

func NewSubscriptionQueries(sc *client.API, m *management.Management) SubscriptionQueries {
	return &subscriptionQueries{
		stripe:     sc,
		management: m,
		loader:     newSubscriptionLoader(sc),
	}
}

func newSubscriptionLoader(sc *client.API) *dataloader.Loader {
	return loader.New("SubscriptionLoader", func(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
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

func (q *subscriptionQueries) GetUserID(ctx context.Context, subID string) (string, error) {
	ctx, span := tracer.Start(ctx, "subscriptionQueries.GetUserID",
		trace.WithAttributes(keys.SubscriptionID(subID)))
	defer span.End()

	query := fmt.Sprintf("app_metadata.stripe_subscription_id:%q", subID)
	users, err := q.management.User.List(management.Query(query))
	if err != nil {
		span.RecordError(ctx, err)
		return "", err
	}

	span.SetAttributes(key.Int("user_count", len(users.Users)))
	if len(users.Users) == 0 {
		span.RecordError(ctx, ErrNoUser)
		return "", ErrNoUser
	}

	userID := users.Users[0].GetID()
	span.SetAttributes(keys.UserID(userID))

	return userID, nil
}

func loadSubscription(ctx context.Context, sc *client.API, id string) (*stripe.Subscription, error) {
	ctx, span := tracer.Start(ctx, "loadSubscription",
		trace.WithAttributes(subscriptionIDKey(id)))
	defer span.End()

	sub, err := sc.Subscriptions.Get(id, &stripe.SubscriptionParams{})
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	return sub, nil
}
