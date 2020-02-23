package courier

import (
	"net/http"
	"sync"

	"github.com/mjm/courier-js/internal/functions"
	"github.com/mjm/courier-js/internal/functions/ping"
)

var pingHandler http.Handler
var initPing sync.Once

func Ping(w http.ResponseWriter, r *http.Request) {
	initPing.Do(func() {
		handler, err := ping.InitializeHandler(secretConfig)
		if err != nil {
			panic(err)
		}
		pingHandler = functions.WrapHTTP(handler)
	})

	pingHandler.ServeHTTP(w, r)
}
