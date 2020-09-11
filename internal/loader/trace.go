package loader

import (
	"context"
	"fmt"
	"sync"

	"github.com/graph-gophers/dataloader"
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/kv"
	"go.opentelemetry.io/otel/api/trace"
)

var tracer = global.TraceProvider().Tracer("courier.blog/internal/loader")

var (
	loaderKey       = kv.Key("loader.key")
	loaderKeyCount  = kv.Key("loader.key_count")
	successCountKey = kv.Key("loader.success_count")
	errorCountKey   = kv.Key("loader.error_count")
)

type DataloaderTracer struct {
	Label string

	loadSpans []trace.Span
	lock      sync.Mutex
}

var _ dataloader.Tracer = (*DataloaderTracer)(nil)

// TraceLoad will trace the calls to Load
func (t *DataloaderTracer) TraceLoad(ctx context.Context, key dataloader.Key) (context.Context, dataloader.TraceLoadFinishFunc) {
	ctx, span := tracer.Start(ctx, fmt.Sprintf("%s.Load", t.Label),
		trace.WithAttributes(
			loaderKey.String(key.String())))

	t.addLoadSpan(span)

	return ctx, func(thunk dataloader.Thunk) {
		_, err := thunk()
		if err != nil {
			span.RecordError(ctx, err)
		}
		span.End()
	}
}

// TraceLoadMany will trace the calls to LoadMany
func (t *DataloaderTracer) TraceLoadMany(ctx context.Context, keys dataloader.Keys) (context.Context, dataloader.TraceLoadManyFinishFunc) {
	ctx, span := tracer.Start(ctx, fmt.Sprintf("%s.LoadMany", t.Label),
		trace.WithAttributes(
			loaderKeyCount.Int(len(keys))))

	t.addLoadSpan(span)

	return ctx, func(thunk dataloader.ThunkMany) {
		_, errs := thunk()

		var successCount, errCount int

		for _, err := range errs {
			if err == nil {
				successCount++
			} else {
				errCount++
				span.RecordError(ctx, err)
			}
		}

		span.SetAttributes(
			successCountKey.Int(successCount),
			errorCountKey.Int(errCount))

		span.End()
	}
}

// TraceBatch will trace data loader batches
func (t *DataloaderTracer) TraceBatch(ctx context.Context, keys dataloader.Keys) (context.Context, dataloader.TraceBatchFinishFunc) {
	opts := []trace.StartOption{
		trace.WithAttributes(loaderKeyCount.Int(len(keys))),
	}
	opts = append(opts, t.popLinks()...)
	ctx, span := tracer.Start(ctx, fmt.Sprintf("%s.BatchLoad", t.Label), opts...)

	return ctx, func(results []*dataloader.Result) {
		var successCount, errCount int

		// results is currently always empty
		// https://github.com/graph-gophers/dataloader/issues/63
		for _, res := range results {
			if res.Error == nil {
				successCount++
			} else {
				errCount++
				span.RecordError(ctx, res.Error)
			}
		}

		span.SetAttributes(
			successCountKey.Int(successCount),
			errorCountKey.Int(errCount))

		span.End()
	}
}

func (t *DataloaderTracer) addLoadSpan(span trace.Span) {
	t.lock.Lock()
	defer t.lock.Unlock()

	t.loadSpans = append(t.loadSpans, span)
}

func (t *DataloaderTracer) popLinks() []trace.StartOption {
	t.lock.Lock()
	defer t.lock.Unlock()

	var opts []trace.StartOption

	for _, span := range t.loadSpans {
		opts = append(opts, trace.LinkedTo(span.SpanContext()))
	}

	t.loadSpans = nil

	return opts
}
