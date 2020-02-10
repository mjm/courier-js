package resolvers

import (
	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/read/feeds"
)

type PostConnection struct {
	q    Queries
	conn *pager.Connection
}

func (c *PostConnection) Edges() []*PostEdge {
	var edges []*PostEdge
	for _, edge := range c.conn.Edges {
		edges = append(edges, &PostEdge{
			q:    c.q,
			edge: edge.(*feeds.Post),
		})
	}
	return edges
}

func (c *PostConnection) Nodes() []*Post {
	var nodes []*Post
	for _, edge := range c.conn.Edges {
		node := edge.(*feeds.Post)
		nodes = append(nodes, NewPost(c.q, node))
	}
	return nodes
}

func (c *PostConnection) PageInfo() PageInfo {
	return PageInfo{c.conn.PageInfo}
}

func (c *PostConnection) TotalCount() int32 {
	return c.conn.TotalCount
}

type PostEdge struct {
	q    Queries
	edge *feeds.Post
}

func (e *PostEdge) Node() *Post {
	return NewPost(e.q, e.edge)
}

func (e *PostEdge) Cursor() pager.Cursor {
	return e.edge.Cursor()
}
