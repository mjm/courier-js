package main

import (
	"github.com/mjm/courier-js/internal/functions"
	"github.com/mjm/courier-js/internal/functions/indieauthcb"
)

var indieAuthCallbackHandler = functions.NewHTTP("indieauth_callback", func() (functions.HTTPHandler, error) {
	return indieauthcb.InitializeHandler(secretConfig)
})
