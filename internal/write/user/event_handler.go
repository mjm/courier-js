package user

import (
	"context"

	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/shared/billing"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/internal/write"
)

var EventHandlerSet = wire.NewSet(DefaultSet, NewEventHandler)

type EventHandler struct {
	commandBus *write.CommandBus
}

func NewEventHandler(commandBus *write.CommandBus, events event.Source, _ *CommandHandler) *EventHandler {
	h := &EventHandler{
		commandBus: commandBus,
	}
	events.Notify(h)
	return h
}

func (h *EventHandler) HandleEvent(ctx context.Context, evt interface{}) {
	switch evt := evt.(type) {

	case billing.CustomerCreated:
		if _, err := h.commandBus.Run(ctx, UpdateCustomerCommand{
			UserID:     evt.UserId,
			CustomerID: evt.CustomerId,
		}); err != nil {
			trace.Error(ctx, err)
		}

	case billing.SubscriptionCreated:
		if _, err := h.commandBus.Run(ctx, UpdateSubscriptionCommand{
			UserID:         evt.UserId,
			SubscriptionID: evt.SubscriptionId,
		}); err != nil {
			trace.Error(ctx, err)
		}

	}
}
