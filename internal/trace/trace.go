package trace

import (
	"context"
	"os"
	"time"

	"github.com/google/uuid"
	"github.com/honeycombio/libhoney-go"

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
	fields    Fields
	sent      bool
}

// Fields is a map of string keys for adding data to a trace event.
type Fields map[string]interface{}

// Config gives fields to configure tracing.
type Config struct {
	Dataset  string
	WriteKey string
}

func NewConfigFromSecrets(sk secret.Keeper) (cfg Config, err error) {
	cfg.WriteKey, err = sk.GetString(context.Background(), "honey-write-key")
	if err != nil {
		return
	}

	cfg.Dataset = os.Getenv("HONEY_DATASET")
	return
}

// Init initializes tracing support so it is correctly configured.
func Init(cfg Config) {
	var logger libhoney.Logger
	if os.Getenv("APP_ENV") == "dev" {
		logger = &libhoney.DefaultLogger{}
	}
	libhoney.Init(libhoney.Config{
		WriteKey: cfg.WriteKey,
		Dataset:  cfg.Dataset,
		Logger:   logger,
	})
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

// Start beings a new trace or span.
func Start(ctx context.Context, name string) context.Context {
	var trace *traceContext
	parent := getTraceContext(ctx)
	if parent == nil {
		trace = &traceContext{
			traceID: uuid.New().String(),
		}
	} else {
		trace = &traceContext{
			traceID:  parent.traceID,
			parentID: parent.spanID,
		}
	}
	trace.spanID = uuid.New().String()
	trace.name = name
	trace.fields = make(Fields)
	trace.timestamp = time.Now()

	return context.WithValue(ctx, &traceContextKey, trace)
}

// Finish finishes a span or tracing, sending the corresponding event.
func Finish(ctx context.Context) {
	trace := getTraceContext(ctx)
	if trace == nil {
		return
	}

	e := libhoney.NewEvent()
	e.Timestamp = trace.timestamp
	e.AddField("duration_ms", time.Since(trace.timestamp).Milliseconds())
	e.AddField("name", trace.name)
	e.AddField("trace.trace_id", trace.traceID)
	e.AddField("trace.span_id", trace.spanID)
	if trace.parentID != "" {
		e.AddField("trace.parent_id", trace.parentID)
	}
	e.Add(trace.fields)

	e.Send()
	trace.sent = true
}

// AddField sets a single field on the current span.
func AddField(ctx context.Context, key string, value interface{}) {
	trace := getTraceContext(ctx)
	if trace == nil {
		return
	}

	trace.fields[key] = value
}

// Add sets a map of fields on the current span.
func Add(ctx context.Context, fields Fields) {
	trace := getTraceContext(ctx)
	if trace == nil {
		return
	}

	for k, v := range fields {
		trace.fields[k] = v
	}
}

// Error sets the error on the current span.
func Error(ctx context.Context, err error) {
	AddField(ctx, "error", err.Error())
}

func getTraceContext(ctx context.Context) *traceContext {
	v := ctx.Value(&traceContextKey)
	if v == nil {
		return nil
	}

	return v.(*traceContext)
}
