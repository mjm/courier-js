package resolvers

import (
	"context"

	"github.com/mjm/graphql-go"
	"github.com/mjm/graphql-go/relay"

	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/shared/model"
)

type Feed struct {
	q Queries
	f *model.Feed
}

func NewFeed(q Queries, f *model.Feed) *Feed {
	return &Feed{q: q, f: f}
}

func (f *Feed) ID() graphql.ID {
	return relay.MarshalID(FeedNode, f.f.ID)
}

func (f *Feed) URL() string {
	return f.f.URL
}

func (f *Feed) Title() string {
	return f.f.Title
}

func (f *Feed) HomePageURL() string {
	return f.f.HomePageURL
}

func (f *Feed) MicropubEndpoint() string {
	return f.f.MicropubEndpoint
}

func (f *Feed) RefreshedAt() *graphql.Time {
	if f.f.RefreshedAt != nil {
		return &graphql.Time{Time: *f.f.RefreshedAt}
	}
	return nil
}

func (f *Feed) CreatedAt() graphql.Time {
	return graphql.Time{Time: f.f.CreatedAt}
}

func (f *Feed) UpdatedAt() graphql.Time {
	return graphql.Time{Time: f.f.UpdatedAt}
}

func (f *Feed) Autopost() bool {
	return f.f.Autopost
}

func (f *Feed) Posts(ctx context.Context, args pager.Options) (*PostConnection, error) {
	conn, err := f.q.Posts.Paged(ctx, f.f.ID, args)
	if err != nil {
		return nil, err
	}

	return &PostConnection{conn: conn, q: f.q}, nil
}
