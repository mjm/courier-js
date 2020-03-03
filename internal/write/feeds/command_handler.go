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
		CreateCommand{},
		SubscribeCommand{},
		RefreshCommand{},
		UpdateOptionsCommand{},
		UnsubscribeCommand{},
		ImportPostsCommand{})
	return h
}

// HandleCommand dispatches a command to the appropriate handler function and returns the result.
func (h *CommandHandler) HandleCommand(ctx context.Context, cmd interface{}) (interface{}, error) {
	switch cmd := cmd.(type) {

	case CreateCommand:
		feedID, err := h.handleCreate(ctx, cmd)
		return feedID, err

	case SubscribeCommand:
		subID, err := h.handleSubscribe(ctx, cmd)
		return subID, err

	case RefreshCommand:
		err := h.handleRefresh(ctx, cmd)
		return nil, err

	case UpdateOptionsCommand:
		return nil, h.handleUpdateOptions(ctx, cmd)

	case UnsubscribeCommand:
		err := h.handleUnsubscribe(ctx, cmd)
		return nil, err

	case ImportPostsCommand:
		err := h.handleImportPosts(ctx, cmd)
		return nil, err

	}

	panic(fmt.Errorf("feeds.CommandHandler does not know how to handle command type %v", reflect.TypeOf(cmd)))
}
