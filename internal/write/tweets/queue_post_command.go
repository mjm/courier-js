package tweets

import (
	"context"

	"github.com/segmentio/ksuid"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/shared/model"
	"github.com/mjm/courier-js/internal/shared/tweets"
	"github.com/mjm/courier-js/internal/tasks"
	"github.com/mjm/courier-js/internal/trace/keys"
)

type EnqueuePostCommand struct {
	TweetGroupID model.TweetGroupID
}

func (h *CommandHandler) handleQueuePost(ctx context.Context, cmd EnqueuePostCommand) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(keys.TweetGroupID(cmd.TweetGroupID)...)

	taskName := ksuid.New().String()
	span.SetAttributes(keys.TaskName(taskName))

	if err := h.tweetRepo.EnqueuePost(ctx, cmd.TweetGroupID, taskName); err != nil {
		return err
	}

	task := &tweets.PostTweetTask{
		UserId: cmd.TweetGroupID.UserID,
		FeedId: string(cmd.TweetGroupID.FeedID),
		ItemId: cmd.TweetGroupID.ItemID,
	}
	if _, err := h.tasks.Enqueue(ctx, task, tasks.Named(taskName)); err != nil {
		return err
	}

	return nil
}
