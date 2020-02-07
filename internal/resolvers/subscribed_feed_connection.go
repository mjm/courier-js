package resolvers

import (
	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/read/feeds"
)

type SubscribedFeedConnection struct {
	q    Queries
	conn *pager.Connection
}

func (c *SubscribedFeedConnection) Edges() []*SubscribedFeedEdge {
	var edges []*SubscribedFeedEdge
	for _, edge := range c.conn.Edges {
		edges = append(edges, &SubscribedFeedEdge{q: c.q, edge: edge})
	}
	return edges
}

func (c *SubscribedFeedConnection) Nodes() []*SubscribedFeed {
	var nodes []*SubscribedFeed
	for _, edge := range c.conn.Edges {
		node := edge.Node.(*feeds.Subscription)
		nodes = append(nodes, NewSubscribedFeed(c.q, node))
	}
	return nodes
}

func (c *SubscribedFeedConnection) PageInfo() PageInfo {
	return PageInfo{c.conn.PageInfo}
}

func (c *SubscribedFeedConnection) TotalCount() int32 {
	return c.conn.TotalCount
}

type SubscribedFeedEdge struct {
	q    Queries
	edge pager.Edge
}

func (e *SubscribedFeedEdge) Node() *SubscribedFeed {
	return NewSubscribedFeed(e.q, e.edge.Node.(*feeds.Subscription))
}

func (e *SubscribedFeedEdge) Cursor() pager.Cursor {
	return e.edge.Cursor
}
