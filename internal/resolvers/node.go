package resolvers

import (
	"github.com/mjm/graphql-go"
)

const (
	TweetNode          string = "twt"
	PostNode           string = "post"
	FeedNode           string = "feed"
	SubscribedFeedNode string = "sub"
	EventNode          string = "evt"
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

func (n *Node) ToSubscribedFeed() (*SubscribedFeedDynamo, bool) {
	sf, ok := n.nodeResolver.(*SubscribedFeedDynamo)
	return sf, ok
}

func (n *Node) ToTweet() (*TweetDynamo, bool) {
	t, ok := n.nodeResolver.(*TweetDynamo)
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
