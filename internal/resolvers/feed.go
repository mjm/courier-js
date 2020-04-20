package resolvers

import (
	"context"

	"github.com/mjm/graphql-go"
	"github.com/mjm/graphql-go/relay"

	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/read/feeds"
	"github.com/mjm/courier-js/internal/shared/model"
)

type Feed struct {
	q    Queries
	feed *feeds.Feed
}

func NewFeed(q Queries, feed *feeds.Feed) *Feed {
	return &Feed{q: q, feed: feed}
}

func (f *Feed) ID() graphql.ID {
	return relay.MarshalID(FeedNode, f.feed.ID)
}

func (f *Feed) URL() string {
	return f.feed.URL
}

func (f *Feed) Title() string {
	return f.feed.Title
}

func (f *Feed) HomePageURL() string {
	return f.feed.HomePageURL
}

func (f *Feed) MicropubEndpoint() string {
	return f.feed.MPEndpoint
}

func (f *Feed) RefreshedAt() *graphql.Time {
	if f.feed.RefreshedAt.Valid {
		return &graphql.Time{
			Time: f.feed.RefreshedAt.Time,
		}
	}
	return nil
}

func (f *Feed) CreatedAt() graphql.Time {
	return graphql.Time{Time: f.feed.CreatedAt}
}

func (f *Feed) UpdatedAt() graphql.Time {
	return graphql.Time{Time: f.feed.UpdatedAt}
}

func (f *Feed) Posts(ctx context.Context, args pager.Options) (*PostConnection, error) {
	conn, err := f.q.Posts.Paged(ctx, f.feed.ID, args)
	if err != nil {
		return nil, err
	}

	return &PostConnection{
		conn: conn,
		q:    f.q,
	}, nil
}

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

func (f *FeedDynamo) Posts(ctx context.Context, args pager.Options) (*PostConnection, error) {
	return &PostConnection{
		conn: &pager.Connection{},
		q:    f.q,
	}, nil
	// TODO
	// conn, err := f.q.Posts.Paged(ctx, f.feed.ID, args)
	// if err != nil {
	// 	return nil, err
	// }
	//
	// return &PostConnection{
	// 	conn: conn,
	// 	q:    f.q,
	// }, nil
}
