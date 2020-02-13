package resolvers

import (
	"context"
	"strings"

	"github.com/mjm/graphql-go"
	"github.com/mjm/graphql-go/relay"

	"github.com/mjm/courier-js/internal/read/feeds"
	"github.com/mjm/courier-js/internal/read/tweets"
	"github.com/mjm/courier-js/internal/read/user"
)

type Event struct {
	q     Queries
	event *user.Event
}

func NewEvent(q Queries, e *user.Event) *Event {
	return &Event{q: q, event: e}
}

func (e *Event) ID() graphql.ID {
	return relay.MarshalID(string(EventNode), e.event.ID)
}

func (e *Event) EventType() string {
	return strings.ToUpper(string(e.event.EventType))
}

func (e *Event) CreatedAt() graphql.Time {
	return graphql.Time{Time: e.event.CreatedAt}
}

func (e *Event) Feed(ctx context.Context) (*Feed, error) {
	if e.event.Params.FeedID == "" {
		return nil, nil
	}

	f, err := e.q.Feeds.Get(ctx, feeds.FeedID(e.event.Params.FeedID))
	if err != nil {
		return nil, err
	}

	return NewFeed(e.q, f), nil
}

func (e *Event) Tweet(ctx context.Context) (*Tweet, error) {
	if e.event.Params.TweetID == "" {
		return nil, nil
	}

	t, err := e.q.Tweets.Get(ctx, tweets.TweetID(e.event.Params.TweetID))
	if err != nil {
		return nil, err
	}

	return NewTweet(e.q, t), nil
}

func (e *Event) BoolValue() *bool {
	return e.event.Params.ParamValue
}
