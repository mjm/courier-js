package functions

import (
	"context"
	"errors"
	"net/http"

	"github.com/mjm/courier-js/internal/trace"
)

type HTTPHandler interface {
	HandleHTTP(ctx context.Context, w http.ResponseWriter, r *http.Request) error
}

func WrapHTTP(h HTTPHandler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer trace.Flush()

		ctx := trace.Start(r.Context(), "HTTP request")
		defer trace.Finish(ctx)

		trace.Add(ctx, trace.Fields{
			"http.url":    r.URL.Path,
			"http.method": r.Method,
		})

		if err := h.HandleHTTP(ctx, w, r); err != nil {
			trace.Error(ctx, err)
			var httpErr HTTPError
			if errors.As(err, &httpErr) {
				http.Error(w, httpErr.Error(), httpErr.statusCode)
			} else {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
			return
		}
	})
}

type HTTPError struct {
	err        error
	statusCode int
}

func WrapHTTPError(err error, code int) HTTPError {
	return HTTPError{err: err, statusCode: code}
}

func (e HTTPError) Error() string {
	return e.err.Error()
}
