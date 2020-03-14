package trace

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/honeycombio/libhoney-go"
	"github.com/honeycombio/opentelemetry-exporter-go/honeycomb"
	"go.opentelemetry.io/otel/api/core"
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"
	exporttrace "go.opentelemetry.io/otel/sdk/export/trace"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"

	"github.com/mjm/courier-js/internal/secret"
)

type contextKey struct{}

var traceContextKey contextKey

type traceContext struct {
	traceID   string
	spanID    string
	parentID  string
	name      string
	timestamp time.Time
	builder   *libhoney.Builder
	fields    Fields
	sent      bool
}

// Fields is a map of string keys for adding data to a trace event.
type Fields map[string]interface{}

type ServiceName string

func newExporter(cfg Config, svcname ServiceName) (*honeycomb.Exporter, error) {
	return honeycomb.NewExporter(
		honeycomb.Config{
			APIKey: cfg.WriteKey,
		},
		honeycomb.TargetingDataset(cfg.Dataset),
		honeycomb.WithServiceName(string(svcname)),
		honeycomb.WithField("env", os.Getenv("APP_ENV")))
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

var tracer = global.TraceProvider().Tracer("courier.blog/internal/trace")

// Start beings a new trace or span.
func Start(ctx context.Context, name string) context.Context {
	ctx, _ = tracer.Start(ctx, name)
	return ctx
}

// Finish finishes a span or tracing, sending the corresponding event.
func Finish(ctx context.Context) {
	span := trace.SpanFromContext(ctx)
	span.End()
}

// AddField sets a single field on the current span.
func AddField(ctx context.Context, k string, value interface{}) {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(key.String(k, fmt.Sprintf("%s", value)))
}

// Add sets a map of fields on the current span.
func Add(ctx context.Context, fields Fields) {
	span := trace.SpanFromContext(ctx)

	var kvs []core.KeyValue
	for k, v := range fields {
		kvs = append(kvs, key.String(k, fmt.Sprintf("%s", v)))
	}

	span.SetAttributes(kvs...)
}

// Error sets the error on the current span.
func Error(ctx context.Context, err error) {
	span := trace.SpanFromContext(ctx)
	span.RecordError(ctx, err)
}

func GetTraceID(ctx context.Context) string {
	trace := getTraceContext(ctx)
	if trace == nil {
		return ""
	}

	return trace.traceID
}

func GetSpanID(ctx context.Context) string {
	trace := getTraceContext(ctx)
	if trace == nil {
		return ""
	}

	return trace.spanID
}

func SetParent(ctx context.Context, traceID string, parentID string) {
	if traceID == "" || parentID == "" {
		return
	}

	trace := getTraceContext(ctx)
	if trace == nil {
		return
	}

	trace.traceID = traceID
	trace.parentID = parentID
}

func getTraceContext(ctx context.Context) *traceContext {
	v := ctx.Value(&traceContextKey)
	if v == nil {
		return nil
	}

	return v.(*traceContext)
}
