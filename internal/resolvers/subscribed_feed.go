package resolvers

import (
	"github.com/mjm/graphql-go"
	"github.com/mjm/graphql-go/relay"

	"github.com/mjm/courier-js/internal/shared/model"
)

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
