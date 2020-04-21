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

func (e *Event) Feed(ctx context.Context) (*Feed, error) {
	return nil, nil
	// if e.event.Params.FeedID == "" {
	// 	return nil, nil
	// }
	//
	// f, err := e.q.Feeds.Get(ctx, feeds.FeedID(e.event.Params.FeedID))
	// if err != nil {
	// 	return nil, err
	// }
	//
	// return NewFeed(e.q, f), nil
}

func (e *Event) SubscribedFeed(ctx context.Context) (*SubscribedFeed, error) {
	return nil, nil
	// if e.event.Params.FeedSubscriptionID == "" {
	// 	return nil, nil
	// }
	//
	// sub, err := e.q.FeedSubscriptions.Get(ctx, feeds.SubscriptionID(e.event.Params.FeedSubscriptionID))
	// if err != nil {
	// 	return nil, err
	// }
	//
	// return NewSubscribedFeed(e.q, sub), nil
}

func (e *Event) Tweet(ctx context.Context) (*Tweet, error) {
	return nil, nil
	// TODO
	// if e.event.Params.TweetID == "" {
	// 	return nil, nil
	// }
	//
	// t, err := e.q.Tweets.Get(ctx, tweets.TweetID(e.event.Params.TweetID))
	// if err != nil {
	// 	return nil, err
	// }
	//
	// return NewTweet(e.q, t), nil
}

func (e *Event) BoolValue() *bool {
	return nil
	// return e.event.Params.ParamValue
}
