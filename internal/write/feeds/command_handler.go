package feeds

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
	NewFeedRepository,
	NewSubscriptionRepository,
	NewPostRepository)

// CommandHandler processes feed-related commands and updates the data store appropriately.
type CommandHandler struct {
	bus      *write.CommandBus
	eventBus *event.Bus
	feedRepo *FeedRepository
	subRepo  *SubscriptionRepository
	postRepo *PostRepository
}

// NewCommandHandler creates a new command handler for feed commands.
func NewCommandHandler(
	bus *write.CommandBus,
	eventBus *event.Bus,
	feedRepo *FeedRepository,
	subRepo *SubscriptionRepository,
	postRepo *PostRepository) *CommandHandler {
	h := &CommandHandler{
		bus:      bus,
		eventBus: eventBus,
		feedRepo: feedRepo,
		subRepo:  subRepo,
		postRepo: postRepo,
	}
	bus.Register(h,
		SubscribeCommand{},
		RefreshCommand{},
		UnsubscribeCommand{},
		ImportPostsCommand{})
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

	case ImportPostsCommand:
		err := h.HandleImportPosts(ctx, cmd)
		return nil, err

	}

	panic(fmt.Errorf("feeds.CommandHandler does not know how to handle command type %v", reflect.TypeOf(cmd)))
}
