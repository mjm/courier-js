package event

import (
	"context"
	"sync"

	"github.com/google/wire"
)

var SourceSet = wire.NewSet(wire.Bind(new(Source), new(*Bus)), NewBus)

type Handler interface {
	HandleEvent(ctx context.Context, evt interface{})
}

type Bus struct {
	handlers map[Handler]struct{}
}

func NewBus() *Bus {
	return &Bus{
		handlers: make(map[Handler]struct{}),
	}
}

func (b *Bus) Notify(h Handler) {
	b.handlers[h] = struct{}{}
}

func (b *Bus) Fire(ctx context.Context, evt interface{}) {
	var wg sync.WaitGroup

	handle := func(h Handler) {
		wg.Add(1)
		go func(h Handler) {
			defer wg.Done()
			h.HandleEvent(ctx, evt)
		}(h)
	}

	// Run all handlers for the event in parallel, but wait for them to complete so they
	// can't outlive the request.
	for h := range b.handlers {
		handle(h)
	}

	wg.Wait()
}
