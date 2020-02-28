package tweets

import (
	"context"

	"github.com/mjm/courier-js/internal/shared/tweets"
	"github.com/mjm/courier-js/internal/trace"
)

type PostCommand struct {
	UserID   string
	TweetID  TweetID
	Autopost bool
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
