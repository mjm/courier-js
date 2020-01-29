package resolvers

import (
	"github.com/graph-gophers/graphql-go"
)

const (
	TweetNode string = "twt"
)

type nodeResolver interface {
	ID() graphql.ID
}

type Node struct {
	nodeResolver
}

func (n *Node) ToTweet() (*Tweet, bool) {
	t, ok := n.nodeResolver.(*Tweet)
	return t, ok
}
