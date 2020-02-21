package resolvers

import (
	"context"

	"github.com/mjm/courier-js/internal/shared/feeds"
)

func (r *Root) watch(ctx context.Context, v interface{}, fn func(evt interface{})) error {
	evts, err := r.subscriber.Subscribe(ctx, v)
	if err != nil {
		return err
	}

	go func() {
		for evt := range evts {
			fn(evt)
		}
	}()

	return nil
}

func (r *Root) FeedRefreshed(ctx context.Context) (<-chan *FeedRefreshed, error) {
	ch := make(chan *FeedRefreshed)

	if err := r.watch(ctx, feeds.FeedRefreshed{}, func(evt interface{}) {
		ch <- &FeedRefreshed{q: r.q, evt: evt.(feeds.FeedRefreshed)}
	}); err != nil {
		return nil, err
	}

	return ch, nil
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
