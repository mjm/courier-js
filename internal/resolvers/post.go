package resolvers

import (
	"context"

	"github.com/graph-gophers/graphql-go"
	"github.com/graph-gophers/graphql-go/relay"

	"github.com/mjm/courier-js/internal/models/post"
)

type Post struct {
	post *post.Post
}

func (p *Post) ID() graphql.ID {
	return relay.MarshalID(FeedNode, p.post.ID)
}

func (p *Post) Feed(ctx context.Context) (*Feed, error) {
	return nil, nil
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
