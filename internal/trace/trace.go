package trace

import (
	"fmt"
	"os"

	"github.com/honeycombio/opentelemetry-exporter-go/honeycomb"
	"go.opentelemetry.io/otel/api/global"
	exporttrace "go.opentelemetry.io/otel/sdk/export/trace"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"

	"github.com/mjm/courier-js/internal/secret"
)

type ServiceName string

func newExporter(cfg Config, svcname ServiceName) (*honeycomb.Exporter, error) {
	return honeycomb.NewExporter(
		honeycomb.Config{
			APIKey: cfg.WriteKey,
		},
		honeycomb.TargetingDataset(cfg.Dataset),
		honeycomb.WithServiceName(string(svcname)),
		honeycomb.WithField("env", os.Getenv("APP_ENV")),
		honeycomb.WithField("service.version", fmt.Sprintf("git:%s", os.Getenv("GIT_REVISION"))))
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
