package tweets

import (
	"context"

	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/shared/tweets"
	"github.com/mjm/courier-js/internal/trace/keys"
)

// UnancelCommand is a request to uncancel a tweet so it becomes a draft again.
type UncancelCommand struct {
	// UserID is the ID of the user that is uncanceling the tweet.
	UserID string
	// TweetID is the ID of the tweet that is being uncanceled.
	TweetID TweetID
}

func (h *CommandHandler) handleUncancel(ctx context.Context, cmd UncancelCommand) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(keys.UserID(cmd.UserID), keys.TweetID(cmd.TweetID))

	if err := h.tweetRepo.Uncancel(ctx, cmd.UserID, cmd.TweetID); err != nil {
		return err
	}

	h.events.Fire(ctx, tweets.TweetUncanceled{
		UserId:  cmd.UserID,
		TweetId: cmd.TweetID.String(),
	})

	return nil
}
