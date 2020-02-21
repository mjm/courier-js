package resolvers

import (
	"context"
	"fmt"

	"github.com/mjm/courier-js/internal/shared/feeds"
)

type eventHandlerFunc struct {
	fn func(context.Context, interface{})
}

func (e *eventHandlerFunc) HandleEvent(ctx context.Context, evt interface{}) {
	e.fn(ctx, evt)
}

func (r *Root) FeedRefreshed(ctx context.Context) <-chan *FeedRefreshed {
	ch := make(chan *FeedRefreshed)
	r.watch(func(ctx context.Context, evt interface{}) {
		fmt.Println("hallo!")
		ch <- &FeedRefreshed{q: r.q, evt: evt.(feeds.FeedRefreshed)}
	}, feeds.FeedRefreshed{})
	return ch
}

func (r *Root) watch(fn func(context.Context, interface{}), v ...interface{}) {
	r.subscriber.Notify(&eventHandlerFunc{fn: fn}, v...)
}

type FeedRefreshed struct {
	q   Queries
	evt feeds.FeedRefreshed
}

func (e *FeedRefreshed) Feed(ctx context.Context) (*Feed, error) {
	f, err := e.q.Feeds.Get(ctx, feeds.FeedID(e.evt.FeedId))
	if err != nil {
		return nil, err
	}

	return NewFeed(e.q, f), nil
}
