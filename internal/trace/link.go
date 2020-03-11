package trace

import (
	"context"
)

func CreateLink(fromCtx context.Context, toCtx context.Context) {
	ctx := Start(fromCtx, "Link")
	defer Finish(ctx)

	Add(ctx, Fields{
		"trace.link.span_id":  GetSpanID(toCtx),
		"trace.link.trace_id": GetTraceID(toCtx),
		"meta.span_type":      "link",
	})
}
