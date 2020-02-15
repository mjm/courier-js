package tweets

import (
	"context"

	"github.com/mjm/courier-js/internal/event/tweetevent"
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

	h.eventBus.Fire(ctx, tweetevent.TweetUncanceled{
		UserID:  cmd.UserID,
		TweetID: string(cmd.TweetID),
	})

	return nil
}
