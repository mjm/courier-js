package tweets

import (
	"context"
	"fmt"

	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/trace/keys"
)

type SendTweetCommand struct {
	Tweet        *Tweet
	Subscription *FeedSubscription
}

func (h *CommandHandler) handleSendTweet(ctx context.Context, cmd SendTweetCommand) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(
		keys.TweetID(cmd.Tweet.ID),
		keys.UserID(cmd.Subscription.UserID),
		keys.FeedSubscriptionID(cmd.Subscription.ID))

	postedTweet, err := h.externalTweetRepo.Create(ctx, cmd.Subscription.UserID, cmd.Tweet)
	if err != nil {
		return err
	}

	span.SetAttributes(key.Int64("tweet.posted_tweet_id", postedTweet.ID))

	if err := h.tweetRepo.Post(ctx, cmd.Tweet.ID, postedTweet.ID); err != nil {
		return err
	}

	tweetURL := fmt.Sprintf("https://twitter.com/%s/status/%d", postedTweet.User.ScreenName, postedTweet.ID)
	span.SetAttributes(keys.TweetURL(tweetURL))

	if _, err := h.bus.Run(ctx, SyndicateCommand{
		UserID:   cmd.Subscription.UserID,
		PostID:   cmd.Tweet.PostID,
		TweetURL: tweetURL,
	}); err != nil {
		return err
	}

	return nil
}
