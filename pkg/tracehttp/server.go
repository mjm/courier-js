package tracehttp

import (
	"net/http"

	"github.com/felixge/httpsnoop"
	"go.opentelemetry.io/otel/api/trace"
)

func WrapHandler(handler http.Handler) http.Handler {
	h := func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		span := trace.SpanFromContext(ctx)

		span.SetAttributes(
			MethodKey(r.Method),
			TargetKey(r.URL.String()),
			HostKey(r.Host),
			FlavorKey(r.Proto),
			UserAgentKey(r.UserAgent()))

		metrics := httpsnoop.CaptureMetrics(handler, w, r)

		span.SetAttributes(
			StatusCodeKey(metrics.Code))
		span.SetStatus(Code(metrics.Code))
	}
	return http.HandlerFunc(h)
}
