package user

import (
	"context"
	"fmt"
	"reflect"

	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/event/billingevent"
	"github.com/mjm/courier-js/internal/write"
)

var DefaultSet = wire.NewSet(
	NewCommandHandler,
	NewUserRepository,
)

type CommandHandler struct {
	bus      *write.CommandBus
	eventBus *event.Bus
	userRepo *UserRepository
}

func NewCommandHandler(
	bus *write.CommandBus,
	eventBus *event.Bus,
	userRepo *UserRepository,
) *CommandHandler {
	h := &CommandHandler{
		bus:      bus,
		eventBus: eventBus,
		userRepo: userRepo,
	}
	bus.Register(h,
		UpdateCustomerCommand{})
	eventBus.Notify(h,
		billingevent.CustomerCreated{},
		billingevent.SubscriptionCreated{})
	return h
}

func (h *CommandHandler) HandleCommand(ctx context.Context, cmd interface{}) (interface{}, error) {
	switch cmd := cmd.(type) {

	case UpdateCustomerCommand:
		return nil, h.handleUpdateCustomer(ctx, cmd)

	case UpdateSubscriptionCommand:
		return nil, h.handleUpdateSubscription(ctx, cmd)

	}

	panic(fmt.Errorf("tweets.CommandHandler does not know how to handle command type %v", reflect.TypeOf(cmd)))
}

func (h *CommandHandler) HandleEvent(ctx context.Context, evt interface{}) {
	switch evt := evt.(type) {

	case billingevent.CustomerCreated:
		h.handleCustomerCreated(ctx, evt)

	case billingevent.SubscriptionCreated:
		h.handleSubscriptionCreated(ctx, evt)

	}
}
