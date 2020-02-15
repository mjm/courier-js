package trace

import (
	"context"

	"github.com/mjm/courier-js/internal/shared/tweets"
)

func UserID(ctx context.Context, userID string) {
	AddField(ctx, "user_id", userID)
}

func TweetID(ctx context.Context, tweetID tweets.TweetID) {
	AddField(ctx, "tweet.id", tweetID)
}
