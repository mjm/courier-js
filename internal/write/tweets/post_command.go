package tweets

import (
	"context"

	"github.com/mjm/courier-js/internal/shared/tweets"
	"github.com/mjm/courier-js/internal/trace"
)

type PostCommand struct {
	UserID  string
	TweetID TweetID
}

func (h *CommandHandler) handlePost(ctx context.Context, cmd PostCommand) error {
	trace.UserID(ctx, cmd.UserID)
	trace.TweetID(ctx, cmd.TweetID)

	// TODO check if user is subscribed

	tweet, err := h.tweetRepo.Get(ctx, cmd.UserID, cmd.TweetID)
	if err != nil {
		return err
	}

	trace.AddField(ctx, "tweet.status", tweet.Status)
	if tweet.Status != Draft {
		return ErrNotDraft
	}

	sendCmd := SendTweetCommand{
		Tweet: tweet,
	}
	if _, err := h.bus.Run(ctx, sendCmd); err != nil {
		return err
	}

	h.eventBus.Fire(ctx, tweets.TweetPosted{
		UserID:     cmd.UserID,
		TweetID:    cmd.TweetID,
		Autoposted: false,
	})

	return nil
}
