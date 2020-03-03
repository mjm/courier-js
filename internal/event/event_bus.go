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
	handlers    map[reflect.Type]map[Handler]struct{}
	handlersAll map[Handler]struct{}
}

func NewBus() *Bus {
	return &Bus{
		handlers:    make(map[reflect.Type]map[Handler]struct{}),
		handlersAll: make(map[Handler]struct{}),
	}
}

func (b *Bus) Notify(h Handler, vs ...interface{}) {
	for _, v := range vs {
		t := reflect.TypeOf(v)
		hMap, ok := b.handlers[t]
		if !ok {
			hMap = make(map[Handler]struct{})
			b.handlers[t] = hMap
		}
		hMap[h] = struct{}{}
	}
}

func (b *Bus) NotifyAll(h Handler) {
	b.handlersAll[h] = struct{}{}
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
	hs := b.handlers[reflect.TypeOf(evt)]
	for h := range hs {
		handle(h)
	}
	for h := range b.handlersAll {
		handle(h)
	}

	wg.Wait()
}
