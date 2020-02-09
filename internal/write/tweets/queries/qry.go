package queries

const (
	// feed_subscriptions.sql
	FeedSubscriptionsByFeedID = "SELECT id, feed_id, user_id, autopost FROM feed_subscriptions WHERE feed_id = $1;"
	FeedSubscriptionsGet      = "SELECT id, feed_id, user_id, autopost FROM feed_subscriptions WHERE	id = $1;"

	// posts.sql
	PostsByIDs  = "SELECT id, item_id, text_content, html_content, title, url, published_at, modified_at FROM posts WHERE id = ANY ($1);"
	PostsRecent = "SELECT id, item_id, text_content, html_content, title, url, published_at, modified_at FROM posts WHERE feed_id = $1 ORDER BY published_at DESC LIMIT 10;"

	// tweets.sql
	TweetsByPostIDs = "SELECT * FROM tweets WHERE feed_subscription_id = $1 AND post_id = ANY ($2) ORDER BY post_id, position;"
	TweetsCancel    = "UPDATE tweets SET status = 'canceled', post_after = NULL, updated_at = CURRENT_TIMESTAMP FROM feed_subscriptions WHERE tweets.feed_subscription_id = feed_subscriptions.id AND feed_subscriptions.user_id = $1 AND tweets.id = $2 AND status <> 'posted';"
	TweetsCreate    = "INSERT INTO tweets (feed_subscription_id, post_after, post_id, action, body, media_urls, retweet_id, position) SELECT $1, $2, v.post_id, v.action, v.body, ARRAY(SELECT json_array_elements_text(v.media_urls)), v.retweet_id, v.position FROM __unnested__ v(post_id, action, body, media_urls, retweet_id, position) RETURNING id;"
	TweetsUpdate    = "UPDATE tweets SET action = v.action, body = v.body, media_urls = v.media_urls, retweet_id = v.retweet_id, updated_at = CURRENT_TIMESTAMP FROM ( SELECT v.id, v.action, v.body, ARRAY(SELECT json_array_elements_text(v.media_urls)), v.retweet_id FROM __unnested__ v(id, action, body, media_urls, retweet_id) ) v WHERE posts.id = v.id;"
)
