package functions

import (
	"context"
	"errors"
	"net/http"
	"sync"

	"go.opentelemetry.io/otel/api/propagation"
	"go.opentelemetry.io/otel/api/trace"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/mjm/courier-js/pkg/tracehttp"
)

func NewHTTP(svcname string, creator func() (HTTPHandler, error)) http.Handler {
	var handler http.Handler
	var init sync.Once

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		init.Do(func() {
			h, err := creator()
			if err != nil {
				panic(err)
			}
			handler = wrapHTTP(h, svcname)
		})

		handler.ServeHTTP(w, r)
	})
}

type HTTPHandler interface {
	HandleHTTP(ctx context.Context, w http.ResponseWriter, r *http.Request) error
}

func wrapHTTP(h HTTPHandler, svcname string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var ctx context.Context
		if extractor, ok := h.(HTTPExtractor); ok {
			var err error
			ctx, err = extractor.Extract(r, Propagators)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		} else {
			ctx = propagation.ExtractHTTP(r.Context(), Propagators, r.Header)
		}

		ctx, span := tracer.Start(ctx, "/"+svcname)
		defer span.End()

		r = r.WithContext(ctx)

		var handler http.Handler
		handler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()
			if err := h.HandleHTTP(ctx, w, r); err != nil {
				code := codes.Unknown
				msg := err.Error()
				httpStatus := http.StatusInternalServerError

				var httpErr HTTPError
				if errors.As(err, &httpErr) {
					httpStatus = httpErr.statusCode
					code = tracehttp.Code(httpStatus)
				} else {
					s := status.Convert(err)
					code = s.Code()
					msg = s.Message()
					httpStatus = tracehttp.StatusCode(code)
				}
				span.RecordError(ctx, err, trace.WithErrorStatus(code))
				http.Error(w, msg, httpStatus)
			}
		})
		handler = tracehttp.WrapHandler(handler)

		handler.ServeHTTP(w, r)
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
