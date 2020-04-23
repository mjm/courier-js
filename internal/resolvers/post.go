package resolvers

import (
	"context"

	"github.com/mjm/graphql-go"
	"github.com/mjm/graphql-go/relay"

	"github.com/mjm/courier-js/internal/shared/model"
)

type Post struct {
	q Queries
	p *model.Post
}

func NewPost(q Queries, p *model.Post) *Post {
	return &Post{q: q, p: p}
}

func (p *Post) ID() graphql.ID {
	return relay.MarshalID(PostNode, p.p.ID)
}

func (p *Post) Feed(ctx context.Context) (*Feed, error) {
	f, err := p.q.Feeds.Get(ctx, p.p.FeedID())
	if err != nil {
		return nil, err
	}
	return NewFeed(p.q, f), nil
}

func (p *Post) ItemID() string {
	return p.p.ItemID()
}

func (p *Post) URL() string {
	return p.p.URL
}

func (p *Post) Title() string {
	return p.p.Title
}

func (p *Post) TextContent() string {
	return p.p.TextContent
}

func (p *Post) HTMLContent() string {
	return p.p.HTMLContent
}

func (p *Post) PublishedAt() *graphql.Time {
	if p.p.PublishedAt != nil {
		return &graphql.Time{Time: *p.p.PublishedAt}
	}
	return nil
}

func (p *Post) ModifiedAt() *graphql.Time {
	if p.p.ModifiedAt != nil {
		return &graphql.Time{Time: *p.p.ModifiedAt}
	}
	return nil
}

func (p *Post) CreatedAt() graphql.Time {
	return graphql.Time{Time: p.p.CreatedAt}
}

func (p *Post) UpdatedAt() graphql.Time {
	return graphql.Time{Time: p.p.UpdatedAt}
}
