package feeds

import (
	"context"
	"fmt"
	"reflect"

	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/tasks"
	"github.com/mjm/courier-js/internal/write"
	"github.com/mjm/courier-js/internal/write/shared"
)

// DefaultSet is a provider set for creating a command handler and its dependencies.
var DefaultSet = wire.NewSet(
	NewCommandHandler,
	NewFeedRepository)

// CommandHandler processes feed-related commands and updates the data store appropriately.
type CommandHandler struct {
	bus            *write.CommandBus
	events         event.Sink
	tasks          *tasks.Tasks
	feedRepo       *FeedRepository
	feedRepoDynamo *shared.FeedRepository
	postRepo       *shared.PostRepository
}

// NewCommandHandler creates a new command handler for feed commands.
func NewCommandHandler(
	bus *write.CommandBus,
	events event.Sink,
	tasks *tasks.Tasks,
	feedRepo *FeedRepository,
	feedRepoDynamo *shared.FeedRepository,
	postRepo *shared.PostRepository) *CommandHandler {
	h := &CommandHandler{
		bus:            bus,
		events:         events,
		tasks:          tasks,
		feedRepo:       feedRepo,
		feedRepoDynamo: feedRepoDynamo,
		postRepo:       postRepo,
	}
	bus.Register(h,
		CreateCommand{},
		SubscribeCommand{},
		PingCommand{},
		QueueRefreshCommand{},
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
		return nil, h.handleSubscribe(ctx, cmd)

	case PingCommand:
		return nil, h.handlePing(ctx, cmd)

	case QueueRefreshCommand:
		return nil, h.handleQueueRefresh(ctx, cmd)

	case RefreshCommand:
		return nil, h.handleRefresh(ctx, cmd)

	case UpdateOptionsCommand:
		return nil, h.handleUpdateOptions(ctx, cmd)

	case UnsubscribeCommand:
		return nil, h.handleUnsubscribe(ctx, cmd)

	case ImportPostsCommand:
		return nil, h.handleImportPosts(ctx, cmd)

	}

	panic(fmt.Errorf("feeds.CommandHandler does not know how to handle command type %v", reflect.TypeOf(cmd)))
}
