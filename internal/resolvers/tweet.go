package resolvers

import (
	"context"
	"strings"

	"github.com/mjm/graphql-go"
	"github.com/mjm/graphql-go/relay"

	"github.com/mjm/courier-js/internal/shared/model"
)

type TweetGroup struct {
	q  Queries
	tg *model.TweetGroup
}

func NewTweetGroup(q Queries, tweet *model.TweetGroup) *TweetGroup {
	return &TweetGroup{q: q, tg: tweet}
}

func (t *TweetGroup) ID() graphql.ID {
	return relay.MarshalID(TweetNode, t.tg.PostID())
}

func (t *TweetGroup) Feed(ctx context.Context) (*Feed, error) {
	f, err := t.q.Feeds.Get(ctx, t.tg.FeedID())
	if err != nil {
		return nil, err
	}

	return NewFeed(t.q, f), nil
}

func (t *TweetGroup) Post(ctx context.Context) (*Post, error) {
	p, err := t.q.Posts.Get(ctx, t.tg.PostID())
	if err != nil {
		return nil, err
	}

	return NewPost(t.q, p), nil
}

func (t *TweetGroup) Action() string {
	return strings.ToUpper(string(t.tg.Action))
}

func (t *TweetGroup) RetweetID() string {
	return t.tg.RetweetID
}

func (t *TweetGroup) Tweets() []*Tweet {
	var ts []*Tweet
	for _, tweet := range t.tg.Tweets {
		ts = append(ts, &Tweet{t: tweet})
	}
	return ts
}

func (t *TweetGroup) Status() string {
	return strings.ToUpper(string(t.tg.Status))
}

func (t *TweetGroup) PostAfter() *graphql.Time {
	if t.tg.PostAfter != nil {
		return &graphql.Time{Time: *t.tg.PostAfter}
	}
	return nil
}

func (t *TweetGroup) PostedAt() *graphql.Time {
	if t.tg.PostedAt != nil {
		return &graphql.Time{Time: *t.tg.PostedAt}
	}
	return nil
}

func (t *TweetGroup) PostedRetweetID() *string {
	if t.tg.PostedRetweetID == "" {
		return nil
	}
	return &t.tg.PostedRetweetID
}

type Tweet struct {
	t *model.Tweet
}

func (t *Tweet) Body() string {
	return t.t.Body
}

func (t *Tweet) MediaURLs() []string {
	return t.t.MediaURLs
}

func (t *Tweet) PostedTweetID() *string {
	if t.t.PostedTweetID == "" {
		return nil
	}
	return &t.t.PostedTweetID
}
