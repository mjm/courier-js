// Code generated by Wire. DO NOT EDIT.

//go:generate wire
//+build !wireinject

package loaders

import (
	"github.com/mjm/courier-js/internal/billing"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/models/feed"
	"github.com/mjm/courier-js/internal/models/post"
	"github.com/mjm/courier-js/internal/models/tweet"
	"github.com/stripe/stripe-go/client"
)

// Injectors from wire.go:

func CreateLoaders(db2 db.DB, sc *client.API) Loaders {
	loader := tweet.NewLoader(db2)
	postLoader := post.NewLoader(db2)
	feedLoader := feed.NewLoader(db2)
	subscriptionLoader := feed.NewSubscriptionLoader(db2)
	customerLoader := billing.NewCustomerLoader(sc)
	billingSubscriptionLoader := billing.NewSubscriptionLoader(sc)
	loaders := Loaders{
		Tweets:            loader,
		Posts:             postLoader,
		Feeds:             feedLoader,
		FeedSubscriptions: subscriptionLoader,
		Customers:         customerLoader,
		Subscriptions:     billingSubscriptionLoader,
	}
	return loaders
}
