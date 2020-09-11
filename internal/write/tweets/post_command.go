package tweets

import (
	"context"
	"errors"

	"go.opentelemetry.io/otel/api/kv"
	"go.opentelemetry.io/otel/api/trace"
	"google.golang.org/grpc/status"

	"github.com/mjm/courier-js/internal/shared/model"
	"github.com/mjm/courier-js/internal/shared/tweets"
	"github.com/mjm/courier-js/internal/trace/keys"
	"github.com/mjm/courier-js/internal/write/shared"
)

var (
	ErrNotSubscribed = errors.New("user is not subscribed")
)

var (
	skippedKey = kv.Key("task.skipped").Bool
)

type PostCommand struct {
	TweetGroupID model.TweetGroupID
	Autopost     bool
	TaskName     string
}

func (h *CommandHandler) handlePost(ctx context.Context, cmd PostCommand) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(keys.TweetGroupID(cmd.TweetGroupID)...)
	span.SetAttributes(keys.TaskName(cmd.TaskName))

	isSubscribed, err := h.userRepo.IsSubscribed(ctx, cmd.TweetGroupID.UserID)
	if err != nil {
		return err
	}
	if !isSubscribed {
		span.RecordError(ctx, ErrNotSubscribed, trace.WithErrorStatus(status.Code(ErrNotSubscribed)))
		return nil
	}

	tg, err := h.tweetRepo.Get(ctx, cmd.TweetGroupID)
	if err != nil {
		return err
	}

	span.SetAttributes(
		kv.String("tweet.expected_task_name", tg.PostTaskName),
		keys.TweetStatus(string(tg.Status)))

	if cmd.TaskName != "" && tg.PostTaskName != cmd.TaskName {
		span.SetAttributes(skippedKey(true))
		return nil
	}

	if tg.Status != model.Draft {
		span.SetAttributes(skippedKey(true))
		span.RecordError(ctx, shared.ErrCannotCancelOrPost, trace.WithErrorStatus(status.Code(shared.ErrCannotCancelOrPost)))
		return nil
	}

	span.SetAttributes(skippedKey(false))

	sendCmd := SendTweetCommand{
		TweetGroup: tg,
	}
	if _, err := h.bus.Run(ctx, sendCmd); err != nil {
		return err
	}

	h.events.Fire(ctx, tweets.TweetPosted{
		UserId:     tg.UserID(),
		FeedId:     string(tg.FeedID()),
		ItemId:     tg.ItemID(),
		Autoposted: cmd.Autopost,
	})

	return nil
}
