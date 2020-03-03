package tweets

import (
	"context"

	"github.com/google/uuid"

	"github.com/mjm/courier-js/internal/shared/tweets"
	"github.com/mjm/courier-js/internal/tasks"
	"github.com/mjm/courier-js/internal/trace"
)

type QueuePostCommand struct {
	UserID  string
	TweetID TweetID
}

func (h *CommandHandler) handleQueuePost(ctx context.Context, cmd QueuePostCommand) error {
	trace.UserID(ctx, cmd.UserID)
	trace.TweetID(ctx, cmd.TweetID)

	taskName := uuid.New().String()
	trace.AddField(ctx, "task.name", taskName)

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
