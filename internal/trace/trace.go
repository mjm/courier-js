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
	trace "go.opentelemetry.io/otel/api/trace"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
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

// Init initializes tracing support so it is correctly configured.
func Init(cfg Config) error {
	exporter, err := honeycomb.NewExporter(
		honeycomb.Config{
			APIKey: cfg.WriteKey,
		},
		honeycomb.TargetingDataset(cfg.Dataset),
		honeycomb.WithField("env", os.Getenv("APP_ENV")))
	if err != nil {
		return err
	}

	tp, err := sdktrace.NewProvider(
		sdktrace.WithConfig(sdktrace.Config{
			DefaultSampler: sdktrace.AlwaysSample(),
		}),
		sdktrace.WithSyncer(exporter))
	if err != nil {
		return err
	}

	global.SetTraceProvider(tp)

	var logger libhoney.Logger
	if os.Getenv("APP_ENV") == "dev" {
		logger = &libhoney.DefaultLogger{}
	}
	libhoney.Init(libhoney.Config{
		WriteKey: cfg.WriteKey,
		Dataset:  cfg.Dataset,
		Logger:   logger,
	})

	libhoney.AddField("env", os.Getenv("APP_ENV"))
	return nil
}

func SetServiceName(svcname string) {
	libhoney.AddField("service_name", svcname)
}

// Flush ensures that any in-flight events get sent.
func Flush() {
	// Don't actually flush: we're running in Cloud Run which is more like a normal server, we might get
	// multiple in-flight requests.

	// if os.Getenv("APP_ENV") != "dev" {
	// 	libhoney.Flush()
	// }
}

func Set(ctx context.Context, key string, value interface{}) {
	trace := getTraceContext(ctx)
	if trace == nil {
		return
	}

	trace.builder.AddField(key, value)
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
