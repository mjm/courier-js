package feeds

import (
	"context"
	"fmt"
	"reflect"

	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/write"
)

// DefaultSet is a provider set for creating a command handler and its dependencies.
var DefaultSet = wire.NewSet(NewCommandHandler, NewFeedRepository, NewSubscriptionRepository)

// CommandHandler processes feed-related commands and updates the data store appropriately.
type CommandHandler struct {
	bus      *write.CommandBus
	feedRepo *FeedRepository
	subRepo  *SubscriptionRepository
}

// NewCommandHandler creates a new command handler for feed commands.
func NewCommandHandler(bus *write.CommandBus, feedRepo *FeedRepository, subRepo *SubscriptionRepository) *CommandHandler {
	h := &CommandHandler{
		bus:      bus,
		feedRepo: feedRepo,
		subRepo:  subRepo,
	}
	bus.Register(h, SubscribeCommand{}, RefreshCommand{}, UnsubscribeCommand{})
	return h
}

// Handle dispatches a command to the appropriate handler function and returns the result.
func (h *CommandHandler) Handle(ctx context.Context, cmd interface{}) (interface{}, error) {
	switch cmd := cmd.(type) {

	case SubscribeCommand:
		subID, err := h.HandleSubscribe(ctx, cmd)
		return subID, err

	case RefreshCommand:
		err := h.HandleRefresh(ctx, cmd)
		return nil, err

	case UnsubscribeCommand:
		err := h.HandleUnsubscribe(ctx, cmd)
		return nil, err

	}

	panic(fmt.Errorf("feeds.CommandHandler does not know how to handle command type %v", reflect.TypeOf(cmd)))
}
