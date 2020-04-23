package resolvers

import (
	"github.com/mjm/graphql-go"
)

const (
	TweetNode string = "twt"
	PostNode  string = "post"
	FeedNode  string = "feed"
	EventNode string = "evt"
)

type nodeResolver interface {
	ID() graphql.ID
}

type Node struct {
	nodeResolver
}

func (n *Node) ToFeed() (*Feed, bool) {
	f, ok := n.nodeResolver.(*Feed)
	return f, ok
}

func (n *Node) ToTweetGroup() (*TweetGroup, bool) {
	t, ok := n.nodeResolver.(*TweetGroup)
	return t, ok
}

func (n *Node) ToPost() (*Post, bool) {
	p, ok := n.nodeResolver.(*Post)
	return p, ok
}

func (n *Node) ToEvent() (*Event, bool) {
	e, ok := n.nodeResolver.(*Event)
	return e, ok
}
