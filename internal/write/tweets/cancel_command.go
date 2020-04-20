package tweets

import (
	"context"

	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/shared/model"
	"github.com/mjm/courier-js/internal/shared/tweets"
	"github.com/mjm/courier-js/internal/trace/keys"
)

// CancelCommand is a request to cancel a tweet so it does not get posted to Twitter.
type CancelCommand struct {
	TweetGroupID model.TweetGroupID
}

func (h *CommandHandler) handleCancel(ctx context.Context, cmd CancelCommand) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(keys.TweetGroupID(cmd.TweetGroupID)...)

	if err := h.tweetRepo.Cancel(ctx, cmd.TweetGroupID); err != nil {
		return err
	}

	h.events.Fire(ctx, tweets.TweetCanceled{
		UserId: cmd.TweetGroupID.UserID,
		FeedId: string(cmd.TweetGroupID.FeedID),
		ItemId: cmd.TweetGroupID.ItemID,
	})

	return nil
}
