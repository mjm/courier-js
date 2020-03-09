package billing

import (
	"context"
	"fmt"
	"reflect"

	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/billing"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/write"
)

var DefaultSet = wire.NewSet(
	NewCommandHandler,
	NewCustomerRepository,
	NewSubscriptionRepository,
)

type CommandHandler struct {
	bus     *write.CommandBus
	events  event.Sink
	config  billing.Config
	cusRepo *CustomerRepository
	subRepo *SubscriptionRepository
}

func NewCommandHandler(
	bus *write.CommandBus,
	events event.Sink,
	config billing.Config,
	cusRepo *CustomerRepository,
	subRepo *SubscriptionRepository,
) *CommandHandler {
	h := &CommandHandler{
		bus:     bus,
		events:  events,
		config:  config,
		cusRepo: cusRepo,
		subRepo: subRepo,
	}
	bus.Register(h,
		SubscribeCommand{},
		CancelCommand{})
	return h
}

func (h *CommandHandler) HandleCommand(ctx context.Context, cmd interface{}) (interface{}, error) {
	switch cmd := cmd.(type) {

	case SubscribeCommand:
		return nil, h.handleSubscribe(ctx, cmd)

	case CancelCommand:
		return nil, h.handleCancel(ctx, cmd)

	}

	panic(fmt.Errorf("billing.CommandHandler does not know how to handle command type %v", reflect.TypeOf(cmd)))
}
