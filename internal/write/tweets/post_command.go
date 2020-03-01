package tweets

import (
	"context"
	"fmt"

	"github.com/mjm/courier-js/internal/shared/tweets"
	"github.com/mjm/courier-js/internal/trace"
)

type PostCommand struct {
	UserID   string
	TweetID  TweetID
	Autopost bool
	TaskName string
}

func (h *CommandHandler) handlePost(ctx context.Context, cmd PostCommand) error {
	trace.UserID(ctx, cmd.UserID)
	trace.TweetID(ctx, cmd.TweetID)
	trace.AddField(ctx, "task.name", cmd.TaskName)

	isSubscribed, err := h.userRepo.IsSubscribed(ctx, cmd.UserID)
	if err != nil {
		return err
	}
	if !isSubscribed {
		return fmt.Errorf("user is not subscribed")
	}

	tweet, err := h.tweetRepo.Get(ctx, cmd.UserID, cmd.TweetID)
	if err != nil {
		return err
	}

	trace.AddField(ctx, "tweet.expected_task_name", tweet.PostTaskName)
	trace.AddField(ctx, "tweet.status", tweet.Status)

	if tweet.PostTaskName == "" || (cmd.TaskName != "" && tweet.PostTaskName != cmd.TaskName) {
		trace.AddField(ctx, "task.skipped", true)
		return nil
	}

	trace.AddField(ctx, "task.skipped", false)

	if tweet.Status != Draft {
		return ErrNotDraft
	}

	sub, err := h.subRepo.Get(ctx, tweet.FeedSubscriptionID)
	if err != nil {
		return err
	}

	trace.FeedSubscriptionID(ctx, sub.ID)

	sendCmd := SendTweetCommand{
		Tweet:        tweet,
		Subscription: sub,
	}
	if _, err := h.bus.Run(ctx, sendCmd); err != nil {
		return err
	}

	h.eventBus.Fire(ctx, tweets.TweetPosted{
		UserId:     cmd.UserID,
		TweetId:    cmd.TweetID.String(),
		Autoposted: cmd.Autopost,
	})

	return nil
}
