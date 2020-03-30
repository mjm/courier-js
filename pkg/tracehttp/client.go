package tracehttp

import (
	"context"
	"net/http"

	"go.opentelemetry.io/otel/api/trace"
	"google.golang.org/grpc/codes"
)

type Transport struct {
	tracer    trace.Tracer
	transport http.RoundTripper
}

var DefaultTransport = &Transport{
	tracer:    tracer,
	transport: http.DefaultTransport,
}

func WrapTransport(transport http.RoundTripper) *Transport {
	if transport == nil {
		transport = http.DefaultTransport
	}
	return &Transport{
		tracer:    tracer,
		transport: transport,
	}
}

func (t *Transport) RoundTrip(r *http.Request) (*http.Response, error) {
	var ctx context.Context
	span := trace.SpanFromContext(r.Context())
	if span.IsRecording() {
		ctx, span = t.tracer.Start(r.Context(), "http.Request",
			trace.WithSpanKind(trace.SpanKindClient),
			trace.WithAttributes(
				MethodKey(r.Method),
				URLKey(r.URL.String()),
				HostKey(r.Host),
				SchemeKey(r.URL.Scheme),
				UserAgentKey(r.UserAgent())))
		defer span.End()
	}

	r = r.WithContext(ctx)

	res, err := t.transport.RoundTrip(r)
	if err != nil {
		span.RecordError(ctx, err, trace.WithErrorStatus(codes.Internal))
		span.SetStatus(codes.Internal, "")
		return nil, err
	}

	span.SetAttributes(
		StatusCodeKey(res.StatusCode),
		StatusTextKey(res.Status),
		FlavorKey(res.Proto))
	span.SetStatus(Code(res.StatusCode), "")
	return res, nil
}
