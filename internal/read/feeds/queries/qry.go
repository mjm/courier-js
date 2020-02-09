package queries

const (
	// feeds.sql
	FeedsLoad = "SELECT * FROM feeds WHERE id = ANY ($1);"

	// posts.sql
	PostsLoad = "SELECT * FROM posts WHERE id = ANY ($1);"

	// subscriptions.sql
	SubscriptionsLoad       = "SELECT * FROM feed_subscriptions WHERE user_id = $1 AND discarded_at IS NULL AND id = ANY ($2);"
	SubscriptionsGetEdge    = "SELECT feed_subscriptions.*, feeds.url FROM feed_subscriptions JOIN feeds ON feed_subscriptions.feed_id = feeds.id WHERE feed_subscriptions.id = $1;"
	SubscriptionsPagerEdges = "SELECT feed_subscriptions.*, feeds.url FROM feed_subscriptions JOIN feeds ON feed_subscriptions.feed_id = feeds.id WHERE user_id = :user_id AND discarded_at IS NULL;"
	SubscriptionsPagerTotal = "SELECT COUNT(*) FROM feed_subscriptions WHERE user_id = :user_id AND discarded_at IS NULL;"
)
