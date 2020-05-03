package event

import (
	"context"
)

// Source is a type that can dispatch events to handlers when they are received.
type Source interface {
	Notify(h Handler)
}

type HandlerFunc func(context.Context, interface{})

func (f HandlerFunc) HandleEvent(ctx context.Context, evt interface{}) {
	f(ctx, evt)
}
