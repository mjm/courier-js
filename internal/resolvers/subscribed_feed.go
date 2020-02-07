package resolvers

import (
	"context"

	"github.com/graph-gophers/graphql-go"
	"github.com/graph-gophers/graphql-go/relay"

	"github.com/mjm/courier-js/internal/models/feed"
)

type SubscribedFeed struct {
	q   Queries
	sub *feed.Subscription
}

func NewSubscribedFeed(q Queries, sub *feed.Subscription) *SubscribedFeed {
	return &SubscribedFeed{
		q:   q,
		sub: sub,
	}
}

func (sf *SubscribedFeed) ID() graphql.ID {
	return relay.MarshalID(SubscribedFeedNode, sf.sub.ID)
}

func (sf *SubscribedFeed) Feed(ctx context.Context) (*Feed, error) {
	f, err := sf.q.Feeds.Get(ctx, sf.sub.FeedID)
	if err != nil {
		return nil, err
	}

	return &Feed{feed: f}, nil
}

func (sf *SubscribedFeed) Autopost() bool {
	return sf.sub.Autopost
}
