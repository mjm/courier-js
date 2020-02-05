package loaders

import (
	"context"

	"github.com/google/wire"
	"github.com/stripe/stripe-go/client"

	"github.com/mjm/courier-js/internal/billing"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/models/feed"
	"github.com/mjm/courier-js/internal/models/post"
	"github.com/mjm/courier-js/internal/models/tweet"
)

// AllLoaders is a Wire provider set that can create a Loaders with all the necessary loaders.
var AllLoaders = wire.NewSet(
	tweet.NewLoader,
	post.NewLoader,
	feed.NewLoader,
	feed.NewSubscriptionLoader,
	billing.NewCustomerLoader,
	billing.NewSubscriptionLoader,
	wire.Struct(new(Loaders),
		"Tweets", "Posts", "Feeds", "FeedSubscriptions", "Customers", "Subscriptions"))

// Loaders contains all of the different data loaders for the app.
//
// Because loaders cache results, they should be recreated for each request.
type Loaders struct {
	Tweets            tweet.Loader
	Posts             post.Loader
	Feeds             feed.Loader
	FeedSubscriptions feed.SubscriptionLoader
	Customers         billing.CustomerLoader
	Subscriptions     billing.SubscriptionLoader
}

type loadersKey struct{}

// WithLoaders creates a new context that has a new set of loaders using the given database.
func WithLoaders(ctx context.Context, db db.DB, sc *client.API) context.Context {
	l := CreateLoaders(db, sc)
	return context.WithValue(ctx, loadersKey{}, &l)
}

// Get retrieves the loaders from the current context.
func Get(ctx context.Context) *Loaders {
	return ctx.Value(loadersKey{}).(*Loaders)
}
