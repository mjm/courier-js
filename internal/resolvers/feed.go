package resolvers

import (
	"context"

	"github.com/mjm/graphql-go"
	"github.com/mjm/graphql-go/relay"

	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/shared/model"
)

type FeedDynamo struct {
	q Queries
	f *model.Feed
}

func NewFeedDynamo(q Queries, f *model.Feed) *FeedDynamo {
	return &FeedDynamo{q: q, f: f}
}

func (f *FeedDynamo) ID() graphql.ID {
	return relay.MarshalID(FeedNode, f.f.ID)
}

func (f *FeedDynamo) URL() string {
	return f.f.URL
}

func (f *FeedDynamo) Title() string {
	return f.f.Title
}

func (f *FeedDynamo) HomePageURL() string {
	return f.f.HomePageURL
}

func (f *FeedDynamo) MicropubEndpoint() string {
	return f.f.MicropubEndpoint
}

func (f *FeedDynamo) RefreshedAt() *graphql.Time {
	if f.f.RefreshedAt != nil {
		return &graphql.Time{Time: *f.f.RefreshedAt}
	}
	return nil
}

func (f *FeedDynamo) CreatedAt() graphql.Time {
	return graphql.Time{Time: f.f.CreatedAt}
}

func (f *FeedDynamo) UpdatedAt() graphql.Time {
	return graphql.Time{Time: f.f.UpdatedAt}
}

func (f *FeedDynamo) Autopost() bool {
	return f.f.Autopost
}

func (f *FeedDynamo) Posts(ctx context.Context, args pager.Options) (*PostConnection, error) {
	conn, err := f.q.Posts.Paged(ctx, f.f.ID, args)
	if err != nil {
		return nil, err
	}

	return &PostConnection{conn: conn, q: f.q}, nil
}
