package tweets

import (
	"context"
	"fmt"
	"reflect"

	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/write"
)

// DefaultSet is a provider set for creating a command handler and its dependencies.
var DefaultSet = wire.NewSet(
	NewCommandHandler,
	NewTweetRepository,
)

// CommandHandler processes tweet-related commands and updates the data store appropriately.
type CommandHandler struct {
	bus       *write.CommandBus
	eventBus  *event.Bus
	tweetRepo *TweetRepository
}

// NewCommandHandler creates a new command handler for tweet commands.
func NewCommandHandler(
	bus *write.CommandBus,
	eventBus *event.Bus,
	tweetRepo *TweetRepository,
) *CommandHandler {
	h := &CommandHandler{
		bus:       bus,
		eventBus:  eventBus,
		tweetRepo: tweetRepo,
	}
	bus.Register(h,
		CancelCommand{},
	)
	return h
}

// Handle dispatches a command to the appropriate handler function and returns the result.
func (h *CommandHandler) Handle(ctx context.Context, cmd interface{}) (interface{}, error) {
	switch cmd := cmd.(type) {

	case CancelCommand:
		return nil, h.HandleCancel(ctx, cmd)

	}

	panic(fmt.Errorf("tweets.CommandHandler does not know how to handle command type %v", reflect.TypeOf(cmd)))
}
