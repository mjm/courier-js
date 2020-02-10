package tweets

import (
	"context"

	"github.com/mjm/courier-js/internal/event/tweetevent"
	"github.com/mjm/courier-js/internal/trace"
)

// CancelCommand is a request to cancel a tweet so it does not get posted to Twitter.
type CancelCommand struct {
	// UserID is the ID of the user that is canceling the tweet.
	UserID string
	// TweetID is the ID of the tweet that is being canceled.
	TweetID TweetID
}

// HandleCancel handles a request from a user to cancel a tweet.
func (h *CommandHandler) HandleCancel(ctx context.Context, cmd CancelCommand) error {
	trace.Add(ctx, trace.Fields{
		"user_id":  cmd.UserID,
		"tweet.id": cmd.TweetID,
	})

	if err := h.tweetRepo.Cancel(ctx, cmd.UserID, cmd.TweetID); err != nil {
		return err
	}

	h.eventBus.Fire(ctx, tweetevent.TweetCanceled{
		UserID:  cmd.UserID,
		TweetID: string(cmd.TweetID),
	})

	return nil
}
