package trace

import (
	"context"
	"log"

	"github.com/stretchr/testify/suite"
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/kv"
	"go.opentelemetry.io/otel/api/trace"
	"go.opentelemetry.io/otel/exporters/otlp"
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

	// stdoutExporter, err := stdout.NewExporter(stdout.Options{})
	// if err != nil {
	// 	log.Fatal(err)
	// }

	provider, err := sdktrace.NewProvider(
		sdktrace.WithConfig(sdktrace.Config{
			DefaultSampler: sdktrace.AlwaysSample(),
			Resource: resource.New(
				kv.String("service.name", "courier"),
				kv.String("service.version", "git:"+ServiceVersion),
				kv.String("env", "test")),
		}),
		// sdktrace.WithSyncer(stdoutExporter),
		sdktrace.WithSyncer(testExporter))
	if err != nil {
		log.Fatal(err)
	}

	global.SetTraceProvider(provider)
}

type TracingSuite struct {
	ctx      context.Context
	suiteCtx context.Context
}

func (ts *TracingSuite) Ctx() context.Context {
	if ts.ctx != nil {
		return ts.ctx
	}
	return ts.suiteCtx
}

func (ts *TracingSuite) Span() trace.Span {
	return trace.SpanFromContext(ts.Ctx())
}

func (ts *TracingSuite) SetupSuite(suite suite.TestingSuite) {
	ctx, _ := tr.Start(context.Background(), suite.T().Name())
	ts.suiteCtx = ctx
}

func (ts *TracingSuite) SetupTest(suite suite.TestingSuite) {
	ctx, _ := tr.Start(ts.suiteCtx, suite.T().Name())
	ts.ctx = ctx
}

func (ts *TracingSuite) TearDownTest() {
	ts.Span().End()
	ts.ctx = nil
}

func (ts *TracingSuite) TearDownSuite() {
	ts.Span().End()
	ts.suiteCtx = nil
}
