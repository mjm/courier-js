package tweets

import (
	"context"

	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/shared/tweets"
	"github.com/mjm/courier-js/internal/trace/keys"
)

// CancelCommand is a request to cancel a tweet so it does not get posted to Twitter.
type CancelCommand struct {
	// UserID is the ID of the user that is canceling the tweet.
	UserID string
	// TweetID is the ID of the tweet that is being canceled.
	TweetID TweetID
}

func (h *CommandHandler) handleCancel(ctx context.Context, cmd CancelCommand) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(keys.UserID(cmd.UserID), keys.TweetID(cmd.TweetID))

	if err := h.tweetRepo.Cancel(ctx, cmd.UserID, cmd.TweetID); err != nil {
		return err
	}

	h.events.Fire(ctx, tweets.TweetCanceled{
		UserId:  cmd.UserID,
		TweetId: cmd.TweetID.String(),
	})

	return nil
}
