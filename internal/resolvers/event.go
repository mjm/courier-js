package resolvers

import (
	"context"
	"strings"

	"github.com/mjm/graphql-go"
	"github.com/mjm/graphql-go/relay"

	"github.com/mjm/courier-js/internal/shared/model"
)

type Event struct {
	q     Queries
	event *model.Event
}

func NewEvent(q Queries, e *model.Event) *Event {
	return &Event{q: q, event: e}
}

func (e *Event) ID() graphql.ID {
	return relay.MarshalID(EventNode, e.event.ID)
}

func (e *Event) EventType() string {
	return strings.ToUpper(string(e.event.EventType))
}

func (e *Event) CreatedAt() graphql.Time {
	return graphql.Time{Time: e.event.CreatedAt}
}

func (e *Event) Feed(ctx context.Context) (*FeedDynamo, error) {
	if e.event.Feed == nil {
		return nil, nil
	}

	f, err := e.q.Feeds.Get(ctx, e.event.Feed.ID)
	if err != nil {
		return nil, err
	}

	return NewFeedDynamo(e.q, f), nil
}

func (e *Event) TweetGroup(ctx context.Context) (*TweetGroup, error) {
	if e.event.TweetGroup == nil {
		return nil, nil
	}

	tg, err := e.q.Tweets.Get(ctx, e.event.TweetGroup.ID)
	if err != nil {
		return nil, err
	}

	return NewTweetGroup(e.q, tg), nil
}

func (e *Event) BoolValue() *bool {
	if e.event.EventType == model.FeedSetAutopost {
		return e.event.Feed.Autopost
	}
	return nil
}
