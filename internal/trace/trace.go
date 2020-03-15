package trace

import (
	"os"

	"github.com/honeycombio/opentelemetry-exporter-go/honeycomb"
	"go.opentelemetry.io/otel/api/global"
	exporttrace "go.opentelemetry.io/otel/sdk/export/trace"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"

	"github.com/mjm/courier-js/internal/secret"
)

type ServiceName string

var ServiceVersion string

func newExporter(cfg Config, svcname ServiceName) (*honeycomb.Exporter, error) {
	return honeycomb.NewExporter(
		honeycomb.Config{
			APIKey: cfg.WriteKey,
		},
		honeycomb.TargetingDataset(cfg.Dataset),
		honeycomb.WithServiceName(string(svcname)),
		honeycomb.WithField("env", os.Getenv("APP_ENV")),
		honeycomb.WithField("service.version", "git:"+ServiceVersion))
}

func newProvider(exporter exporttrace.SpanSyncer) (*sdktrace.Provider, error) {
	return sdktrace.NewProvider(
		sdktrace.WithConfig(sdktrace.Config{
			DefaultSampler: sdktrace.AlwaysSample(),
		}),
		sdktrace.WithSyncer(exporter))
}

// Init initializes tracing support so it is correctly configured.
func Init(cfg secret.GCPConfig, svcname string) error {
	tp, err := initProvider(cfg, ServiceName(svcname))
	if err != nil {
		return err
	}
	global.SetTraceProvider(tp)
	return nil
}
