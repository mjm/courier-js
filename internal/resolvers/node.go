package resolvers

import (
	"github.com/graph-gophers/graphql-go"
)

const (
	TweetNode          string = "twt"
	PostNode           string = "post"
	FeedNode           string = "feed"
	SubscribedFeedNode string = "sub"
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

func (n *Node) ToSubscribedFeed() (*SubscribedFeed, bool) {
	sf, ok := n.nodeResolver.(*SubscribedFeed)
	return sf, ok
}

func (n *Node) ToTweet() (*Tweet, bool) {
	t, ok := n.nodeResolver.(*Tweet)
	return t, ok
}

func (n *Node) ToPost() (*Post, bool) {
	p, ok := n.nodeResolver.(*Post)
	return p, ok
}
