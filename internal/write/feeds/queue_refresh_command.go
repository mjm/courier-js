package feeds

import (
	"context"

	"github.com/segmentio/ksuid"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/shared/model"
	"github.com/mjm/courier-js/internal/tasks"
	"github.com/mjm/courier-js/internal/trace/keys"
)

type QueueRefreshCommand struct {
	UserID string
	FeedID model.FeedID
}

func (h *CommandHandler) handleQueueRefresh(ctx context.Context, cmd QueueRefreshCommand) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(keys.UserID(cmd.UserID), keys.FeedID(cmd.FeedID))

	taskName := ksuid.New().String()
	span.SetAttributes(keys.TaskName(taskName))

	if err := h.feedRepo.EnqueueRefresh(ctx, cmd.UserID, cmd.FeedID, taskName); err != nil {
		return err
	}

	task := &feeds.RefreshFeedTask{
		UserId: cmd.UserID,
		FeedId: string(cmd.FeedID),
	}
	if _, err := h.tasks.Enqueue(ctx, task, tasks.Named(taskName)); err != nil {
		return err
	}

	return nil
}
