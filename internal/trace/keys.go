package trace

import (
	"context"

	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/shared/tweets"
)

func UserID(ctx context.Context, userID string)           { AddField(ctx, "user_id", userID) }
func TweetID(ctx context.Context, tweetID tweets.TweetID) { AddField(ctx, "tweet.id", tweetID) }
func FeedID(ctx context.Context, feedID feeds.FeedID)     { AddField(ctx, "feed.id", feedID) }
func PostID(ctx context.Context, postID feeds.PostID)     { AddField(ctx, "post.id", postID) }
func CustomerID(ctx context.Context, cusID string)        { AddField(ctx, "billing.customer_id", cusID) }

func FeedSubscriptionID(ctx context.Context, subID feeds.SubscriptionID) {
	AddField(ctx, "feed.subscription_id", subID)
}

func SubscriptionID(ctx context.Context, subID string) {
	AddField(ctx, "billing.subscription_id", subID)
}

func FeedURL(ctx context.Context, url string)          { AddField(ctx, "feed.url", url) }
func FeedAutopost(ctx context.Context, autopost bool)  { AddField(ctx, "feed.autopost", autopost) }
func FeedForceRefresh(ctx context.Context, force bool) { AddField(ctx, "feed.force_refresh", force) }
func FeedUpToDate(ctx context.Context, upToDate bool)  { AddField(ctx, "feed.up_to_date", upToDate) }
