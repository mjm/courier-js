package event

import (
	"context"
	"reflect"
	"sync"
)

type Handler interface {
	HandleEvent(ctx context.Context, evt interface{})
}

type Bus struct {
	handlers map[reflect.Type][]Handler
}

func NewBus() *Bus {
	return &Bus{
		handlers: make(map[reflect.Type][]Handler),
	}
}

func (b *Bus) Notify(h Handler, vs ...interface{}) {
	for _, v := range vs {
		t := reflect.TypeOf(v)
		b.handlers[t] = append(b.handlers[t], h)
	}
}

func (b *Bus) Fire(ctx context.Context, evt interface{}) {
	hs := b.handlers[reflect.TypeOf(evt)]
	var wg sync.WaitGroup
	for _, h := range hs {
		// Run all handlers for the event in parallel, but wait for them to complete so they
		// can't outlive the request.
		wg.Add(1)
		go func(h Handler) {
			defer wg.Done()
			h.HandleEvent(ctx, evt)
		}(h)
		wg.Wait()
	}
}
