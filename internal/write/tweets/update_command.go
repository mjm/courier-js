package tweets

import (
	"context"
	"errors"

	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/shared/model"
	"github.com/mjm/courier-js/internal/shared/tweets"
	"github.com/mjm/courier-js/internal/trace/keys"
	"github.com/mjm/courier-js/internal/write/shared"
)

var (
	ErrRetweet = errors.New("cannot edit retweet")
)

type UpdateCommand struct {
	TweetGroupID model.TweetGroupID
	Tweets       []*model.Tweet
}

func (h *CommandHandler) handleUpdate(ctx context.Context, cmd UpdateCommand) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(keys.TweetGroupID(cmd.TweetGroupID)...)
	span.SetAttributes(
		key.Int("tweet.count", len(cmd.Tweets)))

	// fetch the existing tweet so we can do some validation
	tg, err := h.tweetRepo.Get(ctx, cmd.TweetGroupID)
	if err != nil {
		return err
	}

	span.SetAttributes(
		keys.TweetStatus(string(tg.Status)),
		key.String("tweet.action", string(tg.Action)))

	if tg.Status != model.Draft {
		return shared.ErrCannotUpdate
	}

	if tg.Action != model.ActionTweet {
		return ErrRetweet
	}

	params := shared.UpdateTweetParams{
		ID:     cmd.TweetGroupID,
		URL:    tg.URL,
		Tweets: cmd.Tweets,
	}
	if err := h.tweetRepo.Update(ctx, params); err != nil {
		return err
	}

	h.events.Fire(ctx, tweets.TweetEdited{
		UserId: tg.UserID(),
		FeedId: string(tg.FeedID()),
		ItemId: tg.ItemID(),
	})

	return nil
}
