//+build wireinject

package trace

import (
	"github.com/google/wire"
	"github.com/honeycombio/opentelemetry-exporter-go/honeycomb"
	trace2 "go.opentelemetry.io/otel/sdk/export/trace"
	"go.opentelemetry.io/otel/sdk/trace"

	"github.com/mjm/courier-js/internal/config"
	"github.com/mjm/courier-js/internal/secret"
)

func initProvider(_ secret.GCPConfig, _ ServiceName) (*trace.Provider, error) {
	panic(wire.Build(
		config.DefaultSet,
		secret.GCPSet,
		NewConfig,
		wire.Bind(new(trace2.SpanSyncer), new(*honeycomb.Exporter)),
		newExporter,
		newProvider))
}

func initProviderLambda(_ ServiceName) (*trace.Provider, error) {
	panic(wire.Build(
		config.DefaultSet,
		secret.AWSSet,
		NewConfig,
		wire.Bind(new(trace2.SpanSyncer), new(*honeycomb.Exporter)),
		newExporter,
		newProvider))
}
