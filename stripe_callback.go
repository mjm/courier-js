package courier

import (
	"net/http"
	"sync"

	"github.com/mjm/courier-js/internal/functions/stripecb"
)

var initStripeCallback sync.Once
var stripeCallbackHandler *stripecb.Handler

func StripeCallback(w http.ResponseWriter, r *http.Request) {
	initStripeCallback.Do(func() {
		var err error
		stripeCallbackHandler, err = stripecb.InitializeHandler(secretConfig)
		if err != nil {
			panic(err)
		}
	})

	stripeCallbackHandler.HandleHTTP(w, r)
}
