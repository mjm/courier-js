package tweets

import (
	"context"

	"github.com/google/uuid"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/shared/tweets"
	"github.com/mjm/courier-js/internal/tasks"
	"github.com/mjm/courier-js/internal/trace/keys"
)

type QueuePostCommand struct {
	UserID  string
	TweetID TweetID
}

func (h *CommandHandler) handleQueuePost(ctx context.Context, cmd QueuePostCommand) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(keys.UserID(cmd.UserID), keys.TweetID(cmd.TweetID))

	taskName := uuid.New().String()
	span.SetAttributes(keys.TaskName(taskName))

	if err := h.tweetRepo.QueuePost(ctx, cmd.TweetID, taskName); err != nil {
		return err
	}

	task := &tweets.PostTweetTask{
		UserId:  cmd.UserID,
		TweetId: cmd.TweetID.String(),
	}
	if _, err := h.tasks.Enqueue(ctx, task, tasks.Named(taskName)); err != nil {
		return err
	}

	return nil
}
