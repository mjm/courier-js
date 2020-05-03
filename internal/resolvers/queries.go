package resolvers

import (
	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/read/billing"
	"github.com/mjm/courier-js/internal/read/feeds"
	"github.com/mjm/courier-js/internal/read/tweets"
	"github.com/mjm/courier-js/internal/read/user"
)

type Queries struct {
	Feeds         *feeds.FeedQueries
	Posts         *feeds.PostQueries
	Tweets        *tweets.TweetQueries
	Events        *user.EventQueries
	Customers     billing.CustomerQueries
	Subscriptions billing.SubscriptionQueries
}

var QueriesProvider = wire.NewSet(
	wire.Struct(new(Queries), "*"),
	feeds.NewFeedQueries,
	feeds.NewPostQueries,
	tweets.NewTweetQueries,
	user.NewEventQueries,
	billing.NewCustomerQueries,
	billing.NewSubscriptionQueries,
)
