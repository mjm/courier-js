package tweets

import (
	"context"
	"errors"

	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"
	"google.golang.org/grpc/status"

	"github.com/mjm/courier-js/internal/shared/tweets"
	"github.com/mjm/courier-js/internal/trace/keys"
)

var (
	ErrNotSubscribed = errors.New("user is not subscribed")
)

var (
	skippedKey = key.New("task.skipped").Bool
)

type PostCommand struct {
	UserID   string
	TweetID  TweetID
	Autopost bool
	TaskName string
}

func (h *CommandHandler) handlePost(ctx context.Context, cmd PostCommand) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(
		keys.UserID(cmd.UserID),
		keys.TweetID(cmd.TweetID),
		keys.TaskName(cmd.TaskName))

	isSubscribed, err := h.userRepo.IsSubscribed(ctx, cmd.UserID)
	if err != nil {
		return err
	}
	if !isSubscribed {
		span.RecordError(ctx, ErrNotSubscribed, trace.WithErrorStatus(status.Code(ErrNotSubscribed)))
		return nil
	}

	tweet, err := h.tweetRepo.Get(ctx, cmd.UserID, cmd.TweetID)
	if err != nil {
		return err
	}

	span.SetAttributes(
		key.String("tweet.expected_task_name", tweet.PostTaskName),
		keys.TweetStatus(string(tweet.Status)))

	if tweet.PostTaskName == "" || (cmd.TaskName != "" && tweet.PostTaskName != cmd.TaskName) {
		span.SetAttributes(skippedKey(true))
		return nil
	}

	if tweet.Status != Draft {
		span.SetAttributes(skippedKey(true))
		span.RecordError(ctx, ErrNotDraft, trace.WithErrorStatus(status.Code(ErrNotDraft)))
		return nil
	}

	span.SetAttributes(skippedKey(false))

	sub, err := h.subRepo.Get(ctx, tweet.FeedSubscriptionID)
	if err != nil {
		return err
	}

	span.SetAttributes(keys.FeedSubscriptionID(sub.ID))

	sendCmd := SendTweetCommand{
		Tweet:        tweet,
		Subscription: sub,
	}
	if _, err := h.bus.Run(ctx, sendCmd); err != nil {
		return err
	}

	h.events.Fire(ctx, tweets.TweetPosted{
		UserId:     cmd.UserID,
		TweetId:    cmd.TweetID.String(),
		Autoposted: cmd.Autopost,
	})

	return nil
}
