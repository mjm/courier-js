package tweets

import (
	"context"

	"github.com/mjm/courier-js/internal/trace"
)

type SendTweetCommand struct {
	Tweet        *Tweet
	Subscription *FeedSubscription
}

func (h *CommandHandler) handleSendTweet(ctx context.Context, cmd SendTweetCommand) error {
	trace.TweetID(ctx, cmd.Tweet.ID)
	trace.UserID(ctx, cmd.Subscription.UserID)
	trace.FeedSubscriptionID(ctx, cmd.Subscription.ID)

	postedTweet, err := h.externalTweetRepo.Create(ctx, cmd.Subscription.UserID, cmd.Tweet)
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
