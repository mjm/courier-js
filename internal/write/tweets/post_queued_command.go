package tweets

import (
	"context"

	"github.com/mjm/courier-js/internal/shared/tweets"
	"github.com/mjm/courier-js/internal/trace"
)

type PostQueuedCommand struct {
}

func (h *CommandHandler) handlePostQueued(ctx context.Context, _ PostQueuedCommand) error {
	ts, err := h.tweetRepo.Queued(ctx)
	if err != nil {
		return err
	}

	trace.AddField(ctx, "tweet.queued_count", len(ts))

	// TODO consider doing this in parallel
	for _, t := range ts {
		sub, err := h.subRepo.Get(ctx, t.FeedSubscriptionID)
		if err != nil {
			return err
		}

		sendCmd := SendTweetCommand{
			Tweet:        t,
			Subscription: sub,
		}
		if _, err := h.bus.Run(ctx, sendCmd); err != nil {
			// Don't stop on error, because then we might not post other tweets.
			// The error will be tracked in the trace for the SendTweetCommand, so we can still
			// get at it to investigate.
			continue
		}

		h.eventBus.Fire(ctx, tweets.TweetPosted{
			UserId:     sub.UserID,
			TweetId:    t.ID.String(),
			Autoposted: true,
		})
	}

	return nil
}
