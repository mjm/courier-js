package functions

import (
	"go.opentelemetry.io/otel/api/correlation"
	"go.opentelemetry.io/otel/api/propagation"
	"go.opentelemetry.io/otel/api/trace"
)

var (
	tcPropagator = trace.DefaultHTTPPropagator()
	ccPropagator = correlation.DefaultHTTPPropagator()

	Propagators = propagation.New(
		propagation.WithInjectors(tcPropagator, ccPropagator),
		propagation.WithExtractors(tcPropagator, ccPropagator),
	)
)
