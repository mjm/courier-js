package courier

import (
	"net/http"

	"github.com/mjm/courier-js/internal/functions"
	"github.com/mjm/courier-js/internal/functions/ping"
)

var pingHandler = functions.NewHTTP("ping", func() (functions.HTTPHandler, error) {
	return ping.InitializeHandler(secretConfig)
})

func Ping(w http.ResponseWriter, r *http.Request) {
	pingHandler.ServeHTTP(w, r)
}
