package user

import (
	"context"

	"github.com/mjm/courier-js/internal/event/billingevent"
	"github.com/mjm/courier-js/internal/trace"
)

type UpdateSubscriptionCommand struct {
	UserID         string
	SubscriptionID string
}

func (h *CommandHandler) handleUpdateSubscription(ctx context.Context, cmd UpdateSubscriptionCommand) error {
	trace.UserID(ctx, cmd.UserID)
	trace.SubscriptionID(ctx, cmd.SubscriptionID)

	if err := h.userRepo.Update(ctx, UpdateMetadataParams{
		UserID: cmd.UserID,
		AppMetadataParams: AppMetadataParams{
			SubscriptionID: &cmd.SubscriptionID,
		},
	}); err != nil {
		return err
	}

	return nil
}

func (h *CommandHandler) handleSubscriptionCreated(ctx context.Context, evt billingevent.SubscriptionCreated) {
	if _, err := h.bus.Run(ctx, UpdateSubscriptionCommand{
		UserID:         evt.UserID,
		SubscriptionID: evt.SubscriptionID,
	}); err != nil {
		trace.Error(ctx, err)
	}
}
