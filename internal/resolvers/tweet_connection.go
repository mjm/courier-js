package resolvers

import (
	"github.com/mjm/courier-js/internal/models/tweet"
	"github.com/mjm/courier-js/internal/pager"
)

type TweetConnection struct {
	conn *pager.Connection
}

func (c *TweetConnection) Edges() []*TweetEdge {
	var edges []*TweetEdge
	for _, edge := range c.conn.Edges {
		edges = append(edges, &TweetEdge{edge: edge})
	}
	return edges
}

func (c *TweetConnection) Nodes() []*Tweet {
	var nodes []*Tweet
	for _, edge := range c.conn.Edges {
		t := edge.Node.(*tweet.Tweet)
		nodes = append(nodes, &Tweet{tweet: t})
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
	edge pager.Edge
}

func (e *TweetEdge) Node() *Tweet {
	return &Tweet{tweet: e.edge.Node.(*tweet.Tweet)}
}

func (e *TweetEdge) Cursor() pager.Cursor {
	return e.edge.Cursor
}
