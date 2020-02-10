package feeds

import (
	"context"

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

// HandleUnsubscribe handles a request from a user to unsubscribe from a feed.
func (h *CommandHandler) HandleUnsubscribe(ctx context.Context, cmd UnsubscribeCommand) error {
	trace.AddField(ctx, "feed.subscription_id", cmd.SubscriptionID)
	trace.AddField(ctx, "user_id", cmd.UserID)

	if err := h.subRepo.Deactivate(ctx, cmd.UserID, cmd.SubscriptionID); err != nil {
		return err
	}

	// event.Record(ctx, srv.db, event.FeedUnsubscribe, event.Params{
	// 	FeedSubscriptionID: strconv.Itoa(id),
	// })
	return nil
}
