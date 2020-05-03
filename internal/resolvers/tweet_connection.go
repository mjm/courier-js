package resolvers

import (
	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/read/tweets"
)

type TweetConnection struct {
	q    Queries
	conn *pager.Connection
}

func (c *TweetConnection) Edges() []*TweetEdge {
	var edges []*TweetEdge
	for _, edge := range c.conn.Edges {
		edges = append(edges, &TweetEdge{q: c.q, edge: edge.(*tweets.TweetGroupEdge)})
	}
	return edges
}

func (c *TweetConnection) Nodes() []*TweetGroup {
	var nodes []*TweetGroup
	for _, edge := range c.conn.Edges {
		t := &edge.(*tweets.TweetGroupEdge).TweetGroup
		nodes = append(nodes, NewTweetGroup(c.q, t))
	}
	return nodes
}

func (c *TweetConnection) PageInfo() PageInfo {
	return PageInfo{c.conn.PageInfo}
}

func (c *TweetConnection) TotalCount() int32 {
	return c.conn.TotalCount
}

type TweetEdge struct {
	q    Queries
	edge *tweets.TweetGroupEdge
}

func (e *TweetEdge) Node() *TweetGroup {
	return NewTweetGroup(e.q, &e.edge.TweetGroup)
}

func (e *TweetEdge) Cursor() pager.Cursor {
	return e.edge.Cursor()
}
