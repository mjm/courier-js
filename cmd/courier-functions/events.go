package main

import (
	"context"
	"sync"

	"github.com/mjm/courier-js/internal/functions/events"
	"github.com/mjm/courier-js/internal/trace"
)

var initEvents sync.Once
var eventsHandler *events.PubSubHandler

func Events(ctx context.Context, e events.PubSubEvent) error {
	initEvents.Do(func() {
		var err error
		eventsHandler, err = events.InitializeHandler(secretConfig)
		if err != nil {
			panic(err)
		}

		trace.SetServiceName("events")
	})

	return eventsHandler.HandleEvent(ctx, e)
}
