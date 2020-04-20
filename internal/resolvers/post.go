package resolvers

import (
	"context"

	"github.com/mjm/graphql-go"
	"github.com/mjm/graphql-go/relay"

	"github.com/mjm/courier-js/internal/read/feeds"
	"github.com/mjm/courier-js/internal/shared/model"
)

type Post struct {
	q    Queries
	post *feeds.Post
}

func NewPost(q Queries, p *feeds.Post) *Post {
	return &Post{q: q, post: p}
}

func (p *Post) ID() graphql.ID {
	return relay.MarshalID(PostNode, p.post.ID)
}

func (p *Post) Feed(ctx context.Context) (*Feed, error) {
	f, err := p.q.Feeds.Get(ctx, p.post.FeedID)
	if err != nil {
		return nil, err
	}
	return NewFeed(p.q, f), nil
}

func (p *Post) ItemID() string {
	return p.post.ItemID
}

func (p *Post) URL() string {
	return p.post.URL
}

func (p *Post) Title() string {
	return p.post.Title
}

func (p *Post) TextContent() string {
	return p.post.TextContent
}

func (p *Post) HTMLContent() string {
	return p.post.HTMLContent
}

func (p *Post) PublishedAt() *graphql.Time {
	if p.post.PublishedAt.Valid {
		return &graphql.Time{
			Time: p.post.PublishedAt.Time,
		}
	}
	return nil
}

func (p *Post) ModifiedAt() *graphql.Time {
	if p.post.ModifiedAt.Valid {
		return &graphql.Time{
			Time: p.post.ModifiedAt.Time,
		}
	}
	return nil
}

func (p *Post) CreatedAt() graphql.Time {
	return graphql.Time{Time: p.post.CreatedAt}
}

func (p *Post) UpdatedAt() graphql.Time {
	return graphql.Time{Time: p.post.UpdatedAt}
}

type PostDynamo struct {
	q Queries
	p *model.Post
}

func NewPostDynamo(q Queries, p *model.Post) *PostDynamo {
	return &PostDynamo{q: q, p: p}
}

func (p *PostDynamo) ID() graphql.ID {
	return relay.MarshalID(PostNode, p.p.ID)
}

func (p *PostDynamo) Feed(ctx context.Context) (*FeedDynamo, error) {
	f, err := p.q.FeedsDynamo.Get(ctx, p.p.FeedID())
	if err != nil {
		return nil, err
	}
	return NewFeedDynamo(p.q, f), nil
}

func (p *PostDynamo) ItemID() string {
	return p.p.ItemID()
}

func (p *PostDynamo) URL() string {
	return p.p.URL
}

func (p *PostDynamo) Title() string {
	return p.p.Title
}

func (p *PostDynamo) TextContent() string {
	return p.p.TextContent
}

func (p *PostDynamo) HTMLContent() string {
	return p.p.HTMLContent
}

func (p *PostDynamo) PublishedAt() *graphql.Time {
	if p.p.PublishedAt != nil {
		return &graphql.Time{Time: *p.p.PublishedAt}
	}
	return nil
}

func (p *PostDynamo) ModifiedAt() *graphql.Time {
	if p.p.ModifiedAt != nil {
		return &graphql.Time{Time: *p.p.ModifiedAt}
	}
	return nil
}

func (p *PostDynamo) CreatedAt() graphql.Time {
	return graphql.Time{Time: p.p.CreatedAt}
}

func (p *PostDynamo) UpdatedAt() graphql.Time {
	return graphql.Time{Time: p.p.UpdatedAt}
}
