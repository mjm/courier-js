package billing

import (
	"context"
	"errors"

	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/trace/keys"
)

var (
	ErrNotSubscribed = errors.New("not currently subscribed")
)

type CancelCommand struct {
	UserID string
}

func (h *CommandHandler) handleCancel(ctx context.Context, cmd CancelCommand) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(keys.UserID(cmd.UserID))

	user := auth.GetUser(ctx)
	subID := user.SubscriptionID()
	if subID == "" {
		return ErrNotSubscribed
	}

	span.SetAttributes(keys.SubscriptionID(subID))
	if err := h.subRepo.CancelLater(ctx, subID); err != nil {
		return err
	}

	return nil
}
