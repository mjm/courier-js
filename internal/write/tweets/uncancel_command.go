package tweets

import (
	"context"

	"github.com/mjm/courier-js/internal/shared/tweets"
	"github.com/mjm/courier-js/internal/trace"
)

// UnancelCommand is a request to uncancel a tweet so it becomes a draft again.
type UncancelCommand struct {
	// UserID is the ID of the user that is uncanceling the tweet.
	UserID string
	// TweetID is the ID of the tweet that is being uncanceled.
	TweetID TweetID
}

func (h *CommandHandler) handleUncancel(ctx context.Context, cmd UncancelCommand) error {
	trace.UserID(ctx, cmd.UserID)
	trace.TweetID(ctx, cmd.TweetID)

	if err := h.tweetRepo.Uncancel(ctx, cmd.UserID, cmd.TweetID); err != nil {
		return err
	}

	h.eventBus.Fire(ctx, tweets.TweetUncanceled{
		UserID:  cmd.UserID,
		TweetID: cmd.TweetID,
	})

	return nil
}
