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

func (n *Node) ToFeed() (*FeedDynamo, bool) {
	f, ok := n.nodeResolver.(*FeedDynamo)
	return f, ok
}

func (n *Node) ToTweetGroup() (*TweetGroup, bool) {
	t, ok := n.nodeResolver.(*TweetGroup)
	return t, ok
}

func (n *Node) ToPost() (*PostDynamo, bool) {
	p, ok := n.nodeResolver.(*PostDynamo)
	return p, ok
}

func (n *Node) ToEvent() (*Event, bool) {
	e, ok := n.nodeResolver.(*Event)
	return e, ok
}
