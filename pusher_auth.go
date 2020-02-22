package courier

import (
	"net/http"
	"sync"

	"github.com/mjm/courier-js/internal/functions"
	"github.com/mjm/courier-js/internal/functions/pusherauth"
)

var pusherAuthHandler http.Handler
var initPusherAuth sync.Once

func PusherAuth(w http.ResponseWriter, r *http.Request) {
	initPusherAuth.Do(func() {
		h, err := pusherauth.InitializeHandler(secretConfig)
		if err != nil {
			panic(err)
		}
		pusherAuthHandler = functions.WrapHTTP(h)
	})

	pusherAuthHandler.ServeHTTP(w, r)
}
