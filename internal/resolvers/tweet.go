package resolvers

import (
	"context"
	"strings"

	"github.com/graph-gophers/graphql-go"
	"github.com/graph-gophers/graphql-go/relay"

	"github.com/mjm/courier-js/internal/read/feeds"
	"github.com/mjm/courier-js/internal/read/tweets"
)

type Tweet struct {
	q     Queries
	tweet *tweets.Tweet
}

func NewTweet(q Queries, t *tweets.Tweet) *Tweet {
	return &Tweet{q: q, tweet: t}
}

func (t *Tweet) ID() graphql.ID {
	return relay.MarshalID(TweetNode, t.tweet.ID)
}

func (t *Tweet) Feed(ctx context.Context) (*SubscribedFeed, error) {
	sub, err := t.q.FeedSubscriptions.Get(ctx, feeds.SubscriptionID(t.tweet.FeedSubscriptionID))
	if err != nil {
		return nil, err
	}

	return NewSubscribedFeed(t.q, sub), nil
}

func (t *Tweet) Post(ctx context.Context) (*Post, error) {
	p, err := t.q.Posts.Get(ctx, feeds.PostID(t.tweet.PostID))
	if err != nil {
		return nil, err
	}

	return NewPost(t.q, p), nil
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
