package tweets

import (
	"context"
	"fmt"
	"reflect"

	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/event/feedevent"
	"github.com/mjm/courier-js/internal/write"
)

// DefaultSet is a provider set for creating a command handler and its dependencies.
var DefaultSet = wire.NewSet(
	NewCommandHandler,
	NewTweetRepository,
	NewFeedSubscriptionRepository,
	NewPostRepository,
)

// CommandHandler processes tweet-related commands and updates the data store appropriately.
type CommandHandler struct {
	bus       *write.CommandBus
	eventBus  *event.Bus
	tweetRepo *TweetRepository
	subRepo   *FeedSubscriptionRepository
	postRepo  *PostRepository
}

// NewCommandHandler creates a new command handler for tweet commands.
func NewCommandHandler(
	bus *write.CommandBus,
	eventBus *event.Bus,
	tweetRepo *TweetRepository,
	subRepo *FeedSubscriptionRepository,
	postRepo *PostRepository,
) *CommandHandler {
	h := &CommandHandler{
		bus:       bus,
		eventBus:  eventBus,
		tweetRepo: tweetRepo,
		subRepo:   subRepo,
		postRepo:  postRepo,
	}
	bus.Register(h,
		CancelCommand{},
		UncancelCommand{},
		ImportTweetsCommand{},
		ImportRecentPostsCommand{},
	)
	eventBus.Notify(h,
		feedevent.PostsImported{},
		feedevent.FeedSubscribed{},
	)
	return h
}

// HandleCommand dispatches a command to the appropriate handler function and returns the result.
func (h *CommandHandler) HandleCommand(ctx context.Context, cmd interface{}) (interface{}, error) {
	switch cmd := cmd.(type) {

	case CancelCommand:
		return nil, h.HandleCancel(ctx, cmd)

	case UncancelCommand:
		return nil, h.handleUncancel(ctx, cmd)

	case ImportTweetsCommand:
		return nil, h.handleImportTweets(ctx, cmd)

	case ImportRecentPostsCommand:
		return nil, h.handleImportRecentPosts(ctx, cmd)

	}

	panic(fmt.Errorf("tweets.CommandHandler does not know how to handle command type %v", reflect.TypeOf(cmd)))
}

func (h *CommandHandler) HandleEvent(ctx context.Context, evt interface{}) {
	switch evt := evt.(type) {

	case feedevent.PostsImported:
		h.handlePostsImported(ctx, evt)

	case feedevent.FeedSubscribed:
		h.handleFeedSubscribed(ctx, evt)

	}
}
