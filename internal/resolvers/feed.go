package resolvers

import (
	"github.com/graph-gophers/graphql-go"
	"github.com/graph-gophers/graphql-go/relay"

	"github.com/mjm/courier-js/internal/read/feeds"
)

type Feed struct {
	feed *feeds.Feed
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
