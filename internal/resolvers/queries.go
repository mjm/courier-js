package resolvers

import (
	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/read/feeds"
)

type Queries struct {
	Feeds             feeds.FeedQueries
	FeedSubscriptions feeds.SubscriptionQueries
	Posts             feeds.PostQueries
}

var QueriesProvider = wire.NewSet(
	wire.Struct(new(Queries), "*"),
	feeds.NewFeedQueries,
	feeds.NewSubscriptionQueries,
	feeds.NewPostQueries,
)
