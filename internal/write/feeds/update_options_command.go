package feeds

import (
	"context"

	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/trace"
)

type UpdateOptionsCommand struct {
	UserID         string
	SubscriptionID SubscriptionID
	Autopost       bool
}

func (h *CommandHandler) handleUpdateOptions(ctx context.Context, cmd UpdateOptionsCommand) error {
	trace.UserID(ctx, cmd.UserID)
	trace.FeedSubscriptionID(ctx, cmd.SubscriptionID)
	trace.FeedAutopost(ctx, cmd.Autopost)

	if err := h.subRepo.Update(ctx, cmd.UserID, UpdateSubscriptionParams{
		ID:       cmd.SubscriptionID,
		Autopost: cmd.Autopost,
	}); err != nil {
		return err
	}

	h.eventBus.Fire(ctx, feeds.FeedOptionsChanged{
		SubscriptionId: cmd.SubscriptionID.String(),
		UserId:         cmd.UserID,
		Autopost:       cmd.Autopost,
	})

	return nil
}
