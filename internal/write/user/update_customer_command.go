package user

import (
	"context"

	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/trace/keys"
)

type UpdateCustomerCommand struct {
	UserID     string
	CustomerID string
}

func (h *CommandHandler) handleUpdateCustomer(ctx context.Context, cmd UpdateCustomerCommand) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(keys.UserID(cmd.UserID), keys.CustomerID(cmd.CustomerID))

	if err := h.userRepo.Update(ctx, UpdateMetadataParams{
		UserID: cmd.UserID,
		AppMetadataParams: AppMetadataParams{
			CustomerID: &cmd.CustomerID,
		},
	}); err != nil {
		return err
	}

	return nil
}
