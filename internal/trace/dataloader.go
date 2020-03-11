package trace

import (
	"context"
	"fmt"
	"strings"
	"sync"

	"github.com/graph-gophers/dataloader"
)

type DataloaderTracer struct {
	Label string

	loadContexts []context.Context
	lock         sync.Mutex
}

var _ dataloader.Tracer = (*DataloaderTracer)(nil)

// TraceLoad will trace the calls to Load
func (t *DataloaderTracer) TraceLoad(ctx context.Context, key dataloader.Key) (context.Context, dataloader.TraceLoadFinishFunc) {
	ctx = Start(ctx, fmt.Sprintf("%s: Load one request", t.Label))
	AddField(ctx, "loader.key", key.String())

	t.addLoadContext(ctx)

	return ctx, func(thunk dataloader.Thunk) {
		_, err := thunk()
		if err != nil {
			Error(ctx, err)
		}
		Finish(ctx)
	}
}

// TraceLoadMany will trace the calls to LoadMany
func (t *DataloaderTracer) TraceLoadMany(ctx context.Context, keys dataloader.Keys) (context.Context, dataloader.TraceLoadManyFinishFunc) {
	ctx = Start(ctx, fmt.Sprintf("%s: Load many request", t.Label))
	AddField(ctx, "loader.key_count", len(keys))

	t.addLoadContext(ctx)

	return ctx, func(thunk dataloader.ThunkMany) {
		_, errs := thunk()

		var successCount, errCount int
		var errMsg strings.Builder

		for _, err := range errs {
			if err == nil {
				successCount++
			} else {
				if errCount > 0 {
					errMsg.WriteString("\n")
				}
				errCount++
				errMsg.WriteString(err.Error())
			}
		}
		Add(ctx, Fields{
			"loader.success_count": successCount,
			"loader.error_count":   errCount,
		})
		if errCount > 0 {
			AddField(ctx, "error", errMsg.String())
		}

		Finish(ctx)
	}
}

// TraceBatch will trace data loader batches
func (t *DataloaderTracer) TraceBatch(ctx context.Context, keys dataloader.Keys) (context.Context, dataloader.TraceBatchFinishFunc) {
	ctx = Start(ctx, fmt.Sprintf("%s: Batch load", t.Label))
	AddField(ctx, "loader.key_count", len(keys))

	t.createLinks(ctx)

	return ctx, func(results []*dataloader.Result) {
		var successCount, errCount int
		var errMsg strings.Builder

		// results is currently always empty
		// https://github.com/graph-gophers/dataloader/issues/63
		for _, res := range results {
			if res.Error == nil {
				successCount++
			} else {
				if errCount > 0 {
					errMsg.WriteString("\n")
				}
				errCount++
				errMsg.WriteString(res.Error.Error())
			}
		}
		Add(ctx, Fields{
			"loader.success_count": successCount,
			"loader.error_count":   errCount,
		})
		if errCount > 0 {
			AddField(ctx, "error", errMsg.String())
		}

		Finish(ctx)
	}
}

func (t *DataloaderTracer) addLoadContext(ctx context.Context) {
	t.lock.Lock()
	defer t.lock.Unlock()

	t.loadContexts = append(t.loadContexts, ctx)
}

func (t *DataloaderTracer) createLinks(ctx context.Context) {
	t.lock.Lock()
	defer t.lock.Unlock()

	for _, loadCtx := range t.loadContexts {
		CreateLink(loadCtx, ctx)
	}
	t.loadContexts = nil
}
