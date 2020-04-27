package main

import (
	"github.com/mjm/courier-js/internal/functions/events"
)

var eventsHandler *events.Handler

func init() {
	var err error
	eventsHandler, err = events.InitializeLambda()
	if err != nil {
		panic(err)
	}
}
