package resolvers

import (
	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/read/feeds"
	"github.com/mjm/courier-js/internal/shared/model"
)

type FeedConnection struct {
	q    Queries
	conn *pager.Connection
}

func (c *FeedConnection) Edges() []*FeedEdge {
	var edges []*FeedEdge
	for _, edge := range c.conn.Edges {
		edges = append(edges, &FeedEdge{
			q:    c.q,
			edge: edge.(feeds.FeedEdge),
		})
	}
	return edges
}

func (c *FeedConnection) Nodes() []*Feed {
	var nodes []*Feed
	for _, edge := range c.conn.Edges {
		node := model.Feed(edge.(feeds.FeedEdge))
		nodes = append(nodes, NewFeed(c.q, &node))
	}
	return nodes
}

func (c *FeedConnection) PageInfo() PageInfo {
	return PageInfo{c.conn.PageInfo}
}

func (c *FeedConnection) TotalCount() int32 {
	return c.conn.TotalCount
}

type FeedEdge struct {
	q    Queries
	edge feeds.FeedEdge
}

func (e *FeedEdge) Node() *Feed {
	n := model.Feed(e.edge)
	return NewFeed(e.q, &n)
}

func (e *FeedEdge) Cursor() pager.Cursor {
	return e.edge.Cursor()
}
