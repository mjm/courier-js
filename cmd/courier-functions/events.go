package main

import (
	"github.com/mjm/courier-js/internal/functions"
	"github.com/mjm/courier-js/internal/functions/events"
)

var eventsHandler = functions.NewHTTP("events", func() (functions.HTTPHandler, error) {
	return events.InitializeHandler(secretConfig)
})
