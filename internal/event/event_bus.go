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
	handlers map[reflect.Type]map[Handler]struct{}
}

func NewBus() *Bus {
	return &Bus{
		handlers: make(map[reflect.Type]map[Handler]struct{}),
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

func (b *Bus) Fire(ctx context.Context, evt interface{}) {
	hs := b.handlers[reflect.TypeOf(evt)]
	var wg sync.WaitGroup
	for h := range hs {
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
