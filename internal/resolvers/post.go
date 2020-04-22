package resolvers

import (
	"context"

	"github.com/mjm/graphql-go"
	"github.com/mjm/graphql-go/relay"

	"github.com/mjm/courier-js/internal/shared/model"
)

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
