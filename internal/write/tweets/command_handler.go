package tweets

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
	NewTweetRepository,
	NewFeedSubscriptionRepository,
	NewPostRepository,
	NewExternalTweetRepository,
	NewTwitterConfig,
	NewUserRepository,
	NewKeyManagementClient,
)

// CommandHandler processes tweet-related commands and updates the data store appropriately.
type CommandHandler struct {
	bus               *write.CommandBus
	events            event.Sink
	tasks             *tasks.Tasks
	tweetRepo         *TweetRepository
	subRepo           *FeedSubscriptionRepository
	postRepo          *PostRepository
	externalTweetRepo *ExternalTweetRepository
	userRepo          *UserRepository
	feedRepo          *shared.FeedRepository
	tweetRepoDynamo   *shared.TweetRepository
}

// NewCommandHandler creates a new command handler for tweet commands.
func NewCommandHandler(
	bus *write.CommandBus,
	events event.Sink,
	tasks *tasks.Tasks,
	tweetRepo *TweetRepository,
	subRepo *FeedSubscriptionRepository,
	postRepo *PostRepository,
	externalTweetRepo *ExternalTweetRepository,
	userRepo *UserRepository,
	feedRepo *shared.FeedRepository,
	tweetRepoDynamo *shared.TweetRepository,
) *CommandHandler {
	h := &CommandHandler{
		bus:               bus,
		events:            events,
		tasks:             tasks,
		tweetRepo:         tweetRepo,
		subRepo:           subRepo,
		postRepo:          postRepo,
		externalTweetRepo: externalTweetRepo,
		userRepo:          userRepo,
		feedRepo:          feedRepo,
		tweetRepoDynamo:   tweetRepoDynamo,
	}
	bus.Register(h,
		CancelCommand{},
		UncancelCommand{},
		UpdateCommand{},
		PostCommand{},
		QueuePostCommand{},
		SendTweetCommand{},
		ImportTweetsCommand{},
		SyndicateCommand{},
		SetupSyndicationCommand{},
	)
	return h
}

// HandleCommand dispatches a command to the appropriate handler function and returns the result.
func (h *CommandHandler) HandleCommand(ctx context.Context, cmd interface{}) (interface{}, error) {
	switch cmd := cmd.(type) {

	case CancelCommand:
		return nil, h.handleCancel(ctx, cmd)

	case UncancelCommand:
		return nil, h.handleUncancel(ctx, cmd)

	case UpdateCommand:
		return nil, h.handleUpdate(ctx, cmd)

	case PostCommand:
		return nil, h.handlePost(ctx, cmd)

	case QueuePostCommand:
		return nil, h.handleQueuePost(ctx, cmd)

	case SendTweetCommand:
		return nil, h.handleSendTweet(ctx, cmd)

	case ImportTweetsCommand:
		return nil, h.handleImportTweets(ctx, cmd)

	case SyndicateCommand:
		return nil, h.handleSyndicate(ctx, cmd)

	case SetupSyndicationCommand:
		return nil, h.handleSetupSyndication(ctx, cmd)

	}

	panic(fmt.Errorf("tweets.CommandHandler does not know how to handle command type %v", reflect.TypeOf(cmd)))
}
