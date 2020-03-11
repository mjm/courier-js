package feeds

import (
	"context"

	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/tasks"
	"github.com/mjm/courier-js/internal/trace"
)

type QueueRefreshCommand struct {
	UserID string
	FeedID FeedID
}

func (h *CommandHandler) handleQueueRefresh(ctx context.Context, cmd QueueRefreshCommand) error {
	trace.UserID(ctx, cmd.UserID)
	trace.FeedID(ctx, cmd.FeedID)

	task := &feeds.RefreshFeedTask{
		UserId: cmd.UserID,
		FeedId: cmd.FeedID.String(),
	}
	if _, err := h.tasks.Enqueue(ctx, task, tasks.Named(cmd.FeedID.String())); err != nil {
		return err
	}

	return nil
}
