package resolvers

import (
	"github.com/mjm/courier-js/internal/models/feed"
	"github.com/mjm/courier-js/internal/pager"
)

type SubscribedFeedConnection struct {
	conn *pager.Connection
}

func (c *SubscribedFeedConnection) Edges() []*SubscribedFeedEdge {
	var edges []*SubscribedFeedEdge
	for _, edge := range c.conn.Edges {
		edges = append(edges, &SubscribedFeedEdge{edge: edge})
	}
	return edges
}

func (c *SubscribedFeedConnection) Nodes() []*SubscribedFeed {
	var nodes []*SubscribedFeed
	for _, edge := range c.conn.Edges {
		node := edge.Node.(*feed.Subscription)
		nodes = append(nodes, &SubscribedFeed{sub: node})
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
	edge pager.Edge
}

func (e *SubscribedFeedEdge) Node() *SubscribedFeed {
	return &SubscribedFeed{sub: e.edge.Node.(*feed.Subscription)}
}

func (e *SubscribedFeedEdge) Cursor() pager.Cursor {
	return e.edge.Cursor
}
