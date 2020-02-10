package feeds

import (
	"context"

	"github.com/mjm/courier-js/internal/event/feedevent"
	"github.com/mjm/courier-js/internal/trace"
)

type UpdateOptionsCommand struct {
	UserID         string
	SubscriptionID SubscriptionID
	Autopost       bool
}

func (h *CommandHandler) handleUpdateOptions(ctx context.Context, cmd UpdateOptionsCommand) error {
	trace.Add(ctx, trace.Fields{
		"user_id":              cmd.UserID,
		"feed.subscription_id": cmd.SubscriptionID,
		"feed.autopost":        cmd.Autopost,
	})

	if err := h.subRepo.Update(ctx, cmd.UserID, UpdateSubscriptionParams{
		ID:       cmd.SubscriptionID,
		Autopost: cmd.Autopost,
	}); err != nil {
		return err
	}

	h.eventBus.Fire(ctx, feedevent.FeedOptionsChanged{
		SubscriptionID: string(cmd.SubscriptionID),
		UserID:         cmd.UserID,
		Autopost:       cmd.Autopost,
	})

	return nil
}
