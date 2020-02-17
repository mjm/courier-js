package courier

import (
	"net/http"
	"sync"

	"github.com/mjm/courier-js/internal/functions/indieauthcb"
	"github.com/mjm/courier-js/internal/trace"
)

var initIndieAuthCallback sync.Once
var indieAuthCallbackHandler *indieauthcb.Handler

func IndieAuthCallback(w http.ResponseWriter, r *http.Request) {
	initIndieAuthCallback.Do(func() {
		var err error
		indieAuthCallbackHandler, err = indieauthcb.InitializeHandler(secretConfig)
		if err != nil {
			panic(err)
		}

		trace.SetServiceName("indieauth_callback")
	})

	indieAuthCallbackHandler.HandleHTTP(w, r)
}
