package feeds

import (
	"context"

	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/trace"
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
	trace.UserID(ctx, cmd.UserID)
	trace.FeedSubscriptionID(ctx, cmd.SubscriptionID)

	if err := h.subRepo.Deactivate(ctx, cmd.UserID, cmd.SubscriptionID); err != nil {
		return err
	}

	h.eventBus.Fire(ctx, feeds.FeedUnsubscribed{
		SubscriptionId: cmd.SubscriptionID.String(),
		UserId:         cmd.UserID,
	})

	return nil
}
