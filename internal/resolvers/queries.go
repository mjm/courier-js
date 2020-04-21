package resolvers

import (
	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/read/billing"
	"github.com/mjm/courier-js/internal/read/feeds"
	"github.com/mjm/courier-js/internal/read/tweets"
	"github.com/mjm/courier-js/internal/read/user"
)

type Queries struct {
	Feeds             feeds.FeedQueries
	FeedsDynamo       *feeds.FeedQueriesDynamo
	FeedSubscriptions feeds.SubscriptionQueries
	Posts             feeds.PostQueries
	PostsDynamo       *feeds.PostQueriesDynamo
	Tweets            tweets.TweetQueries
	TweetsDynamo      *tweets.TweetQueriesDynamo
	Events            *user.EventQueries
	Customers         billing.CustomerQueries
	Subscriptions     billing.SubscriptionQueries
}

var QueriesProvider = wire.NewSet(
	wire.Struct(new(Queries), "*"),
	feeds.NewFeedQueries,
	feeds.NewFeedQueriesDynamo,
	feeds.NewSubscriptionQueries,
	feeds.NewPostQueries,
	feeds.NewPostQueriesDynamo,
	tweets.NewTweetQueries,
	tweets.NewTweetQueriesDynamo,
	user.NewEventQueries,
	billing.NewCustomerQueries,
	billing.NewSubscriptionQueries,
)
