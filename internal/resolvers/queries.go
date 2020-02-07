package resolvers

import (
	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/read/feeds"
	"github.com/mjm/courier-js/internal/read/user"
)

type Queries struct {
	Feeds             feeds.FeedQueries
	FeedSubscriptions feeds.SubscriptionQueries
	Posts             feeds.PostQueries
	Events            user.EventQueries
}

var QueriesProvider = wire.NewSet(
	wire.Struct(new(Queries), "*"),
	feeds.NewFeedQueries,
	feeds.NewSubscriptionQueries,
	feeds.NewPostQueries,
	user.NewEventQueries,
)
