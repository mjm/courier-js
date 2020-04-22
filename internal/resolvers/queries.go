package resolvers

import (
	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/read/billing"
	"github.com/mjm/courier-js/internal/read/feeds"
	"github.com/mjm/courier-js/internal/read/tweets"
	"github.com/mjm/courier-js/internal/read/user"
)

type Queries struct {
	FeedsDynamo   *feeds.FeedQueriesDynamo
	PostsDynamo   *feeds.PostQueriesDynamo
	TweetsDynamo  *tweets.TweetQueriesDynamo
	Events        *user.EventQueries
	Customers     billing.CustomerQueries
	Subscriptions billing.SubscriptionQueries
}

var QueriesProvider = wire.NewSet(
	wire.Struct(new(Queries), "*"),
	feeds.NewFeedQueriesDynamo,
	feeds.NewPostQueriesDynamo,
	tweets.NewTweetQueriesDynamo,
	user.NewEventQueries,
	billing.NewCustomerQueries,
	billing.NewSubscriptionQueries,
)
