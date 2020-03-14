package user

import (
	"context"

	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/trace/keys"
)

type UpdateSubscriptionCommand struct {
	UserID         string
	SubscriptionID string
}

func (h *CommandHandler) handleUpdateSubscription(ctx context.Context, cmd UpdateSubscriptionCommand) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(keys.UserID(cmd.UserID), keys.SubscriptionID(cmd.SubscriptionID))

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
