package resolvers

import (
	"context"

	"github.com/graph-gophers/graphql-go"
	"github.com/graph-gophers/graphql-go/relay"

	"github.com/mjm/courier-js/internal/loader"
	"github.com/mjm/courier-js/internal/loaders"
	"github.com/mjm/courier-js/internal/models/feed"
)

type SubscribedFeed struct {
	sub *feed.Subscription
}

func (sf *SubscribedFeed) ID() graphql.ID {
	return relay.MarshalID(SubscribedFeedNode, sf.sub.ID)
}

func (sf *SubscribedFeed) Feed(ctx context.Context) (*Feed, error) {
	l := loaders.Get(ctx)
	thunk := l.Feeds.Load(ctx, loader.IntKey(sf.sub.FeedID))
	f, err := thunk()
	if err != nil {
		return nil, err
	}

	return &Feed{feed: f.(*feed.Feed)}, nil
}

func (sf *SubscribedFeed) Autopost() bool {
	return sf.sub.Autopost
}
