package courier

import (
	"net/http"

	"github.com/mjm/courier-js/internal/functions"
	"github.com/mjm/courier-js/internal/functions/tasks"
)

var tasksHandler = functions.NewHTTP("tasks", func() (functions.HTTPHandler, error) {
	return tasks.InitializeHandler(secretConfig)
})

func Tasks(w http.ResponseWriter, r *http.Request) {
	tasksHandler.ServeHTTP(w, r)
}
