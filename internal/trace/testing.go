package trace

import (
	"log"

	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/exporters/otlp"
	"go.opentelemetry.io/otel/exporters/trace/stdout"
	exporttrace "go.opentelemetry.io/otel/sdk/export/trace"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
)

var testExporter exporttrace.SpanSyncer

func InitForTesting() {
	var err error
	testExporter, err = otlp.NewExporter(otlp.WithInsecure())
	if err != nil {
		log.Fatal(err)
	}

	stdoutExporter, err := stdout.NewExporter(stdout.Options{})
	if err != nil {
		log.Fatal(err)
	}

	provider, err := sdktrace.NewProvider(
		sdktrace.WithConfig(sdktrace.Config{
			DefaultSampler: sdktrace.AlwaysSample(),
			Resource: resource.New(
				key.String("service.name", "courier"),
				key.String("service.version", "git:"+ServiceVersion),
				key.String("env", "test")),
		}),
		sdktrace.WithSyncer(testExporter),
		sdktrace.WithSyncer(stdoutExporter))
	if err != nil {
		log.Fatal(err)
	}

	global.SetTraceProvider(provider)
}
