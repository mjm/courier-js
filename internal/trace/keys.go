package trace

import (
	"context"

	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/shared/tweets"
)

func UserID(ctx context.Context, userID string) {
	AddField(ctx, "user_id", userID)
}

func TweetID(ctx context.Context, tweetID tweets.TweetID) {
	AddField(ctx, "tweet.id", tweetID)
}

func FeedID(ctx context.Context, feedID feeds.FeedID) {
	AddField(ctx, "feed.id", feedID)
}

func FeedSubscriptionID(ctx context.Context, subID feeds.SubscriptionID) {
	AddField(ctx, "feed.subscription_id", subID)
}
