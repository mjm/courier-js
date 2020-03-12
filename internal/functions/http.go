package functions

import (
	"context"
	"errors"
	"net/http"
	"sync"

	"go.opentelemetry.io/otel/api/correlation"
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"
	"go.opentelemetry.io/otel/plugin/httptrace"
)

var tracer = global.TraceProvider().Tracer("courier.blog/internal/functions")

var (
	httpMethodKey = key.New("http.method")
	httpStatusKey = key.New("http.response.status")
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
		attrs, tags, spanCtx := httptrace.Extract(r.Context(), r)
		r = r.WithContext(correlation.ContextWithMap(r.Context(), correlation.NewMap(correlation.MapUpdate{
			MultiKV: tags,
		})))

		ctx, span := tracer.Start(trace.ContextWithRemoteSpanContext(r.Context(), spanCtx),
			"HandleHTTP",
			trace.WithAttributes(attrs...),
			trace.WithAttributes(httpMethodKey.String(r.Method)))
		defer span.End()

		// TODO get the service name into all traces
		// trace.Set(ctx, "service_name", svcname)

		if err := h.HandleHTTP(ctx, w, r); err != nil {
			span.RecordError(ctx, err)
			var httpErr HTTPError
			if errors.As(err, &httpErr) {
				http.Error(w, httpErr.Error(), httpErr.statusCode)
				span.SetAttributes(httpStatusKey.Int(httpErr.statusCode))
			} else {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				span.SetAttributes(httpStatusKey.Int(http.StatusInternalServerError))
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
