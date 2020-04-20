package resolvers

import (
	"context"
	"strings"

	"github.com/mjm/graphql-go"
	"github.com/mjm/graphql-go/relay"

	"github.com/mjm/courier-js/internal/read/tweets"
	"github.com/mjm/courier-js/internal/shared/model"
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
	sub, err := t.q.FeedSubscriptions.Get(ctx, t.tweet.FeedSubscriptionID)
	if err != nil {
		return nil, err
	}

	return NewSubscribedFeed(t.q, sub), nil
}

func (t *Tweet) Post(ctx context.Context) (*Post, error) {
	p, err := t.q.Posts.Get(ctx, t.tweet.PostID)
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

type TweetDynamo struct {
	q  Queries
	tg *model.TweetGroup
}

func NewTweetDynamo(q Queries, tweet *model.TweetGroup) *TweetDynamo {
	return &TweetDynamo{q: q, tg: tweet}
}

func (t *TweetDynamo) ID() graphql.ID {
	return relay.MarshalID(TweetNode, t.tg.PostID())
}

func (t *TweetDynamo) Feed(ctx context.Context) (*SubscribedFeed, error) {
	// TODO
	return nil, nil
}

func (t *TweetDynamo) Post(ctx context.Context) (*Post, error) {
	// TODO
	return nil, nil
}

func (t *TweetDynamo) Action() string {
	return strings.ToUpper(string(t.tg.Action))
}

func (t *TweetDynamo) Body() string {
	// TODO change schema to represent tweets as part of groups

	if len(t.tg.Tweets) > 0 {
		return t.tg.Tweets[0].Body
	}
	return ""
}

func (t *TweetDynamo) MediaURLs() []string {
	// TODO change schema to represent tweets as part of groups

	if len(t.tg.Tweets) > 0 {
		return t.tg.Tweets[0].MediaURLs
	}
	return nil
}

func (t *TweetDynamo) RetweetID() string {
	return t.tg.RetweetID
}

func (t *TweetDynamo) Status() string {
	return strings.ToUpper(string(t.tg.Status))
}

func (t *TweetDynamo) PostAfter() *graphql.Time {
	if t.tg.PostAfter != nil {
		return &graphql.Time{Time: *t.tg.PostAfter}
	}
	return nil
}

func (t *TweetDynamo) PostedAt() *graphql.Time {
	if t.tg.PostedAt != nil {
		return &graphql.Time{Time: *t.tg.PostedAt}
	}
	return nil
}

func (t *TweetDynamo) PostedTweetID() *string {
	// TODO change schema to represent tweets as part of groups

	if len(t.tg.Tweets) > 0 && t.tg.Tweets[0].PostedTweetID != "" {
		return &t.tg.Tweets[0].PostedTweetID
	}

	if t.tg.PostedRetweetID != "" {
		return &t.tg.PostedRetweetID
	}

	return nil
}
