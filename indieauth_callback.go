package courier

import (
	"net/http"

	"github.com/mjm/courier-js/internal/functions"
	"github.com/mjm/courier-js/internal/functions/indieauthcb"
)

var indieAuthCallbackHandler = functions.NewHTTP("indieauth_callback", func() (functions.HTTPHandler, error) {
	return indieauthcb.InitializeHandler(secretConfig)
})

func IndieAuthCallback(w http.ResponseWriter, r *http.Request) {
	indieAuthCallbackHandler.ServeHTTP(w, r)
}
