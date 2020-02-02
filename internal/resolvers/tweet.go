package resolvers

import (
	"context"
	"strings"

	"github.com/graph-gophers/graphql-go"
	"github.com/graph-gophers/graphql-go/relay"

	"github.com/mjm/courier-js/internal/loader"
	"github.com/mjm/courier-js/internal/loaders"
	"github.com/mjm/courier-js/internal/models/feed"
	"github.com/mjm/courier-js/internal/models/post"
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

func (t *Tweet) Post(ctx context.Context) (*Post, error) {
	l := loaders.Get(ctx)
	p, err := l.Posts.Load(ctx, loader.IntKey(t.tweet.PostID))()
	if err != nil {
		return nil, err
	}

	return &Post{post: p.(*post.Post)}, nil
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

func (t *Tweet) Status() string {
	return strings.ToUpper(string(t.tweet.Status))
}

func (t *Tweet) PostAfter() *graphql.Time {
	if t.tweet.PostAfter.Valid {
		return &graphql.Time{Time: t.tweet.PostAfter.Time}
	}
	return nil
}

func (t *Tweet) PostedAt() *graphql.Time {
	if t.tweet.PostedAt.Valid {
		return &graphql.Time{Time: t.tweet.PostedAt.Time}
	}
	return nil
}

func (t *Tweet) PostedTweetID() *string {
	if t.tweet.PostedTweetID == "" {
		return nil
	}
	return &t.tweet.PostedTweetID
}
