package trace

import (
	"os"

	"github.com/honeycombio/opentelemetry-exporter-go/honeycomb"
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/kv"
	exporttrace "go.opentelemetry.io/otel/sdk/export/trace"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
)

type ServiceName string

var ServiceVersion string

func newExporter(cfg Config) (*honeycomb.Exporter, error) {
	return honeycomb.NewExporter(
		honeycomb.Config{
			APIKey: cfg.WriteKey,
		},
		honeycomb.TargetingDataset(cfg.Dataset))
}

func newProvider(exporter exporttrace.SpanSyncer, svcname ServiceName) (*sdktrace.Provider, error) {
	return sdktrace.NewProvider(
		sdktrace.WithConfig(sdktrace.Config{
			DefaultSampler: sdktrace.AlwaysSample(),
			Resource: resource.New(
				kv.String("service.name", string(svcname)),
				kv.String("service.version", "git:"+ServiceVersion),
				kv.String("env", os.Getenv("APP_ENV"))),
		}),
		sdktrace.WithSyncer(exporter))
}

func InitLambda(svcname string) error {
	tp, err := initProviderLambda(ServiceName(svcname))
	if err != nil {
		return err
	}
	global.SetTraceProvider(tp)
	return nil
}

var tr = global.Tracer("courier.blog/internal/trace")
