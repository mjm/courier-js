package courier

import (
	"net/http"

	"github.com/mjm/courier-js/internal/functions"
	"github.com/mjm/courier-js/internal/functions/stripecb"
)

var stripeCallbackHandler = functions.NewHTTP("stripe_callback", func() (functions.HTTPHandler, error) {
	return stripecb.InitializeHandler(secretConfig)
})

func StripeCallback(w http.ResponseWriter, r *http.Request) {
	stripeCallbackHandler.ServeHTTP(w, r)
}
