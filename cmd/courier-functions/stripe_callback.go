package main

import (
	"github.com/mjm/courier-js/internal/functions"
	"github.com/mjm/courier-js/internal/functions/stripecb"
)

var stripeCallbackHandler = functions.NewHTTP("stripe_callback", func() (functions.HTTPHandler, error) {
	return stripecb.InitializeLambda()
})
