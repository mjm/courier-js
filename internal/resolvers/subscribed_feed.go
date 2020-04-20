package resolvers

import (
	"context"

	"github.com/mjm/graphql-go"
	"github.com/mjm/graphql-go/relay"

	"github.com/mjm/courier-js/internal/read/feeds"
	"github.com/mjm/courier-js/internal/shared/model"
)

type SubscribedFeed struct {
	q   Queries
	sub *feeds.Subscription
}

func NewSubscribedFeed(q Queries, sub *feeds.Subscription) *SubscribedFeed {
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

	return NewFeed(sf.q, f), nil
}

func (sf *SubscribedFeed) Autopost() bool {
	return sf.sub.Autopost
}

// TODO collapse this in the schema

type SubscribedFeedDynamo struct {
	q Queries
	f *model.Feed
}

func NewSubscribedFeedDynamo(q Queries, f *model.Feed) *SubscribedFeedDynamo {
	return &SubscribedFeedDynamo{
		q: q,
		f: f,
	}
}

func (sf *SubscribedFeedDynamo) ID() graphql.ID {
	return relay.MarshalID(SubscribedFeedNode, sf.f.ID)
}

func (sf *SubscribedFeedDynamo) Feed() *FeedDynamo {
	return NewFeedDynamo(sf.q, sf.f)
}

func (sf *SubscribedFeedDynamo) Autopost() bool {
	return sf.f.Autopost
}
