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
		edges = append(edges, &TweetEdge{q: c.q, edge: edge.(*tweets.TweetEdge)})
	}
	return edges
}

func (c *TweetConnection) Nodes() []*Tweet {
	var nodes []*Tweet
	for _, edge := range c.conn.Edges {
		t := &edge.(*tweets.TweetEdge).Tweet
		nodes = append(nodes, NewTweet(c.q, t))
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
	edge *tweets.TweetEdge
}

func (e *TweetEdge) Node() *Tweet {
	return NewTweet(e.q, &e.edge.Tweet)
}

func (e *TweetEdge) Cursor() pager.Cursor {
	return e.edge.Cursor()
}
