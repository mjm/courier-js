package feeds

import (
	"context"

	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/shared/model"
	"github.com/mjm/courier-js/internal/trace/keys"
)

// UnsubscribeCommand is a request to unsubscribe a user from a feed.
type UnsubscribeCommand struct {
	// UserID is the ID of the user that the subscription belongs to. It is used
	// to ensure that a user is not deleting someone else's subscription.
	UserID string
	FeedID model.FeedID
}

func (h *CommandHandler) handleUnsubscribe(ctx context.Context, cmd UnsubscribeCommand) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(keys.UserID(cmd.UserID), keys.FeedIDDynamo(cmd.FeedID))

	if err := h.feedRepoDynamo.Deactivate(ctx, cmd.UserID, cmd.FeedID); err != nil {
		return err
	}

	h.events.Fire(ctx, feeds.FeedUnsubscribed{
		UserId: cmd.UserID,
		FeedId: string(cmd.FeedID),
	})

	return nil
}
