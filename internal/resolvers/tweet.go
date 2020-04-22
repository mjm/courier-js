package resolvers

import (
	"context"
	"strings"

	"github.com/mjm/graphql-go"
	"github.com/mjm/graphql-go/relay"

	"github.com/mjm/courier-js/internal/shared/model"
)

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

func (t *TweetDynamo) Feed(ctx context.Context) (*FeedDynamo, error) {
	f, err := t.q.FeedsDynamo.Get(ctx, t.tg.FeedID())
	if err != nil {
		return nil, err
	}

	return NewFeedDynamo(t.q, f), nil
}

func (t *TweetDynamo) Post(ctx context.Context) (*PostDynamo, error) {
	p, err := t.q.PostsDynamo.Get(ctx, t.tg.PostID())
	if err != nil {
		return nil, err
	}

	return NewPostDynamo(t.q, p), nil
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
