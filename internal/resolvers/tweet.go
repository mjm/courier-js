package resolvers

import (
	"context"
	"strings"

	"github.com/graph-gophers/graphql-go"
	"github.com/graph-gophers/graphql-go/relay"
	"github.com/mjm/courier-js/internal/loader"
	"github.com/mjm/courier-js/internal/loaders"
	"github.com/mjm/courier-js/internal/models/feed"
	"github.com/mjm/courier-js/internal/models/tweet"
)

type Tweet struct {
	tweet *tweet.Tweet
}

func (t *Tweet) ID() graphql.ID {
	return relay.MarshalID(TweetNode, t.tweet.ID)
}

func (t *Tweet) Feed(ctx context.Context) (*SubscribedFeed, error) {
	l := loaders.Get(ctx)
	thunk := l.FeedSubscriptions.Load(ctx, loader.IntKey(t.tweet.FeedSubscriptionID))
	sub, err := thunk()
	if err != nil {
		return nil, err
	}

	return &SubscribedFeed{sub: sub.(*feed.Subscription)}, nil
}

func (t *Tweet) Action() string {
	return strings.ToUpper(string(t.tweet.Action))
}

func (t *Tweet) Body() string {
	return t.tweet.Body
}

func (t *Tweet) MediaURLS() []string {
	return t.tweet.MediaURLs
}

func (t *Tweet) RetweetID() string {
	return t.tweet.RetweetID
}
