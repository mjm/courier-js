package billing

import (
	"context"
	"errors"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/trace"
)

var (
	ErrNotSubscribed = errors.New("not currently subscribed")
)

type CancelCommand struct {
	UserID string
}

func (h *CommandHandler) handleCancel(ctx context.Context, cmd CancelCommand) error {
	trace.Add(ctx, trace.Fields{
		"user_id": cmd.UserID,
	})

	user := auth.GetUser(ctx)
	subID := user.SubscriptionID()
	if subID == "" {
		return ErrNotSubscribed
	}

	trace.AddField(ctx, "billing.subscription_id", subID)
	if err := h.subRepo.CancelLater(ctx, subID); err != nil {
		return err
	}

	return nil
}
