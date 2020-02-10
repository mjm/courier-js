package queries

const (
	// feeds.sql
	FeedsLoad = "SELECT * FROM feeds WHERE guid = ANY ($1);"

	// posts.sql
	PostsLoad       = "SELECT * FROM posts WHERE guid = ANY ($1);"
	PostsPagerEdges = "SELECT * FROM posts WHERE feed_guid = :feed_id;"
	PostsPagerTotal = "SELECT COUNT(*) FROM posts WHERE feed_guid = :feed_id;"

	// subscriptions.sql
	SubscriptionsLoad       = "SELECT * FROM feed_subscriptions WHERE user_id = $1 AND guid = ANY ($2);"
	SubscriptionsGetEdge    = "SELECT feed_subscriptions.*, feeds.url FROM feed_subscriptions JOIN feeds ON feed_subscriptions.feed_guid = feeds.guid WHERE feed_subscriptions.guid = $1;"
	SubscriptionsPagerEdges = "SELECT feed_subscriptions.*, feeds.url FROM feed_subscriptions JOIN feeds ON feed_subscriptions.feed_guid = feeds.guid WHERE user_id = :user_id AND discarded_at IS NULL;"
	SubscriptionsPagerTotal = "SELECT COUNT(*) FROM feed_subscriptions WHERE user_id = :user_id AND discarded_at IS NULL;"
)
