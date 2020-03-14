package feeds

import (
	"context"

	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/trace/keys"
)

// UnsubscribeCommand is a request to unsubscribe a user from a feed.
type UnsubscribeCommand struct {
	// UserID is the ID of the user that the subscription belongs to. It is used
	// to ensure that a user is not deleting someone else's subscription.
	UserID string
	// SubscriptionID is the ID of the feed subscription to unsubscribe.
	SubscriptionID SubscriptionID
}

func (h *CommandHandler) handleUnsubscribe(ctx context.Context, cmd UnsubscribeCommand) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(keys.UserID(cmd.UserID), keys.FeedSubscriptionID(cmd.SubscriptionID))

	if err := h.subRepo.Deactivate(ctx, cmd.UserID, cmd.SubscriptionID); err != nil {
		return err
	}

	h.events.Fire(ctx, feeds.FeedUnsubscribed{
		FeedSubscriptionId: cmd.SubscriptionID.String(),
		UserId:             cmd.UserID,
	})

	return nil
}
