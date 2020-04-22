package feeds

import (
	"context"

	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/shared/model"
	"github.com/mjm/courier-js/internal/trace/keys"
)

type QueueRefreshCommand struct {
	UserID string
	FeedID model.FeedID
}

func (h *CommandHandler) handleQueueRefresh(ctx context.Context, cmd QueueRefreshCommand) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(keys.UserID(cmd.UserID), keys.FeedID(cmd.FeedID))

	task := &feeds.RefreshFeedTask{
		UserId: cmd.UserID,
		FeedId: string(cmd.FeedID),
	}
	if _, err := h.tasks.Enqueue(ctx, task); err != nil {
		return err
	}

	return nil
}
