package tweets

import (
	"context"
	"fmt"

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

	tweetURL := fmt.Sprintf("https://twitter.com/%s/status/%d", postedTweet.User.ScreenName, postedTweet.ID)
	if _, err := h.bus.Run(ctx, SyndicateCommand{
		UserID:   cmd.Subscription.UserID,
		PostID:   cmd.Tweet.PostID,
		TweetURL: tweetURL,
	}); err != nil {
		return err
	}

	if err := h.tweetRepo.Post(ctx, cmd.Tweet.ID, postedTweet.ID); err != nil {
		return err
	}

	return nil
}
