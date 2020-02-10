package queries

const (
	// tweets.sql
	TweetsLoad       = "SELECT tweets.* FROM tweets JOIN feed_subscriptions ON tweets.feed_subscription_guid = feed_subscriptions.guid WHERE feed_subscriptions.user_id = $1 AND tweets.id = ANY ($2);"
	TweetsPagerEdges = "SELECT tweets.*, posts.published_at FROM tweets JOIN posts ON tweets.post_id = posts.id JOIN feed_subscriptions ON tweets.feed_subscription_guid = feed_subscriptions.guid WHERE feed_subscriptions.user_id = :user_id AND __condition__;"
	TweetsPagerTotal = "SELECT COUNT(*) FROM tweets JOIN feed_subscriptions ON tweets.feed_subscription_guid = feed_subscriptions.guid WHERE feed_subscriptions.user_id = :user_id AND __condition__;"
)
