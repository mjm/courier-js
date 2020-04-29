package tweets

import (
	"context"

	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/shared/model"
	"github.com/mjm/courier-js/internal/shared/tweets"
	"github.com/mjm/courier-js/internal/trace/keys"
)

type PurgeCommand struct {
	UserID string
	FeedID model.FeedID
}

func (h *CommandHandler) handlePurge(ctx context.Context, cmd PurgeCommand) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(keys.UserID(cmd.UserID), keys.FeedID(cmd.FeedID))

	tweetCount, err := h.tweetRepo.PurgeByFeed(ctx, cmd.UserID, cmd.FeedID)
	if err != nil {
		return err
	}

	h.events.Fire(ctx, tweets.TweetsPurged{
		UserId:     cmd.UserID,
		FeedId:     string(cmd.FeedID),
		TweetCount: tweetCount,
	})

	return nil
}
