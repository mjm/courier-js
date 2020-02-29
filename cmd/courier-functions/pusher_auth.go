package main

import (
	"github.com/mjm/courier-js/internal/functions"
	"github.com/mjm/courier-js/internal/functions/pusherauth"
)

var pusherAuthHandler = functions.NewHTTP("pusher_auth", func() (functions.HTTPHandler, error) {
	return pusherauth.InitializeHandler(secretConfig)
})
