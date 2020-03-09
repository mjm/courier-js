package user

import (
	"context"
	"fmt"
	"reflect"

	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/write"
)

var DefaultSet = wire.NewSet(
	NewCommandHandler,
	NewUserRepository,
)

type CommandHandler struct {
	bus      *write.CommandBus
	events   event.Sink
	userRepo *UserRepository
}

func NewCommandHandler(
	bus *write.CommandBus,
	events event.Sink,
	userRepo *UserRepository,
) *CommandHandler {
	h := &CommandHandler{
		bus:      bus,
		events:   events,
		userRepo: userRepo,
	}
	bus.Register(h,
		UpdateCustomerCommand{},
		UpdateSubscriptionCommand{})
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
