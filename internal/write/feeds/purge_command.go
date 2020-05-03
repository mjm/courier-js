package feeds

import (
	"context"

	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/shared/model"
	"github.com/mjm/courier-js/internal/trace/keys"
)

type PurgeCommand struct {
	UserID string
	FeedID model.FeedID
}

func (h *CommandHandler) handlePurge(ctx context.Context, cmd PurgeCommand) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(keys.UserID(cmd.UserID), keys.FeedID(cmd.FeedID))

	err := h.feedRepo.Delete(ctx, cmd.UserID, cmd.FeedID)
	if err != nil {
		return err
	}

	h.events.Fire(ctx, feeds.FeedPurged{
		UserId: cmd.UserID,
		FeedId: string(cmd.FeedID),
	})

	postCount, err := h.postRepo.PurgeByFeed(ctx, cmd.FeedID)
	if err != nil {
		return err
	}

	h.events.Fire(ctx, feeds.PostsPurged{
		UserId:    cmd.UserID,
		FeedId:    string(cmd.FeedID),
		PostCount: postCount,
	})

	return nil
}
