package tweets

import (
	"context"

	"github.com/mjm/courier-js/internal/trace"
)

type SendTweetCommand struct {
	Tweet *Tweet
}

func (h *CommandHandler) handleSendTweet(ctx context.Context, cmd SendTweetCommand) error {
	trace.TweetID(ctx, cmd.Tweet.ID)

	sub, err := h.subRepo.Get(ctx, cmd.Tweet.FeedSubscriptionID)
	if err != nil {
		return err
	}

	trace.UserID(ctx, sub.UserID)
	trace.Add(ctx, trace.Fields{
		"feed.subscription_id": sub.ID,
	})

	postedTweet, err := h.externalTweetRepo.Create(ctx, sub.UserID, cmd.Tweet)
	if err != nil {
		return err
	}

	trace.AddField(ctx, "tweet.posted_tweet_id", postedTweet.ID)

	// TODO publish with micropub

	if err := h.tweetRepo.Post(ctx, cmd.Tweet.ID, postedTweet.ID); err != nil {
		return err
	}

	return nil
}
