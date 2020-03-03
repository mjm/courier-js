package main

import (
	"github.com/mjm/courier-js/internal/functions"
	"github.com/mjm/courier-js/internal/functions/ping"
)

var pingHandler = functions.NewHTTP("ping", func() (functions.HTTPHandler, error) {
	return ping.InitializeHandler(secretConfig)
})
