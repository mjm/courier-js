package resolvers

import (
	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/read/feeds"
	"github.com/mjm/courier-js/internal/shared/model"
)

type SubscribedFeedConnection struct {
	q    Queries
	conn *pager.Connection
}

func (c *SubscribedFeedConnection) Edges() []*SubscribedFeedEdge {
	var edges []*SubscribedFeedEdge
	for _, edge := range c.conn.Edges {
		edges = append(edges, &SubscribedFeedEdge{
			q:    c.q,
			edge: edge.(feeds.FeedEdge),
		})
	}
	return edges
}

func (c *SubscribedFeedConnection) Nodes() []*SubscribedFeedDynamo {
	var nodes []*SubscribedFeedDynamo
	for _, edge := range c.conn.Edges {
		node := model.Feed(edge.(feeds.FeedEdge))
		nodes = append(nodes, NewSubscribedFeedDynamo(c.q, &node))
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
	edge feeds.FeedEdge
}

func (e *SubscribedFeedEdge) Node() *SubscribedFeedDynamo {
	n := model.Feed(e.edge)
	return NewSubscribedFeedDynamo(e.q, &n)
}

func (e *SubscribedFeedEdge) Cursor() pager.Cursor {
	return e.edge.Cursor()
}
