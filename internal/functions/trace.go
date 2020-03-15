package functions

import (
	"context"
	"net/http"

	"go.opentelemetry.io/otel/api/correlation"
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/propagation"
	"go.opentelemetry.io/otel/api/trace"
)

var tracer = global.TraceProvider().Tracer("courier.blog/internal/functions")

var (
	tcPropagator = trace.DefaultHTTPPropagator()
	ccPropagator = correlation.DefaultHTTPPropagator()

	Propagators = propagation.New(
		propagation.WithInjectors(tcPropagator, ccPropagator),
		propagation.WithExtractors(tcPropagator, ccPropagator),
	)
)

type HTTPExtractor interface {
	Extract(r *http.Request, propagators propagation.Propagators) (context.Context, error)
}
