package user

import (
	"context"

	"github.com/mjm/courier-js/internal/event/billingevent"
	"github.com/mjm/courier-js/internal/trace"
)

type UpdateCustomerCommand struct {
	UserID     string
	CustomerID string
}

func (h *CommandHandler) handleUpdateCustomer(ctx context.Context, cmd UpdateCustomerCommand) error {
	trace.Add(ctx, trace.Fields{
		"user_id":             cmd.UserID,
		"billing.customer_id": cmd.CustomerID,
	})

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

func (h *CommandHandler) handleCustomerCreated(ctx context.Context, evt billingevent.CustomerCreated) {
	if _, err := h.bus.Run(ctx, UpdateCustomerCommand{
		UserID:     evt.UserID,
		CustomerID: evt.CustomerID,
	}); err != nil {
		trace.Error(ctx, err)
	}
}