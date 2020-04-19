package tweets

import (
	"context"

	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/shared/model"
	"github.com/mjm/courier-js/internal/shared/tweets"
	"github.com/mjm/courier-js/internal/trace/keys"
)

// UncancelCommand is a request to uncancel a tweet so it becomes a draft again.
type UncancelCommand struct {
	TweetGroupID model.TweetGroupID
}

func (h *CommandHandler) handleUncancel(ctx context.Context, cmd UncancelCommand) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(keys.TweetGroupID(cmd.TweetGroupID)...)

	if err := h.tweetRepoDynamo.Uncancel(ctx, cmd.TweetGroupID); err != nil {
		return err
	}

	h.events.Fire(ctx, tweets.TweetUncanceled{
		UserId: cmd.TweetGroupID.UserID,
		FeedId: string(cmd.TweetGroupID.FeedID),
		ItemId: cmd.TweetGroupID.ItemID,
	})

	return nil
}
