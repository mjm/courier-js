package queries

const (
	// feed_subscriptions.sql
	FeedSubscriptionsByFeedID = "SELECT guid, feed_guid, user_id, autopost FROM feed_subscriptions WHERE feed_guid = $1;"
	FeedSubscriptionsGet      = "SELECT guid, feed_guid, user_id, autopost FROM feed_subscriptions WHERE	guid = $1;"

	// posts.sql
	PostsByIDs  = "SELECT guid, item_id, text_content, html_content, title, url, published_at, modified_at FROM posts WHERE guid = ANY ($1);"
	PostsRecent = "SELECT guid, item_id, text_content, html_content, title, url, published_at, modified_at FROM posts WHERE feed_guid = $1 ORDER BY published_at DESC LIMIT 10;"

	// tweets.sql
	TweetsGet       = "SELECT t.* FROM tweets t JOIN feed_subscriptions fs ON t.feed_subscription_guid = fs.guid WHERE fs.user_id = $1 AND t.guid = $2;"
	TweetsByPostIDs = "SELECT * FROM tweets WHERE feed_subscription_guid = $1 AND post_guid = ANY ($2) ORDER BY post_guid, position;"
	TweetsCancel    = "UPDATE tweets SET status = 'canceled', post_after = NULL, updated_at = CURRENT_TIMESTAMP FROM feed_subscriptions WHERE tweets.feed_subscription_guid = feed_subscriptions.guid AND feed_subscriptions.user_id = $1 AND tweets.guid = $2 AND status <> 'posted';"
	TweetsUncancel  = "UPDATE tweets SET status = 'draft', post_after = NULL, updated_at = CURRENT_TIMESTAMP FROM feed_subscriptions WHERE tweets.feed_subscription_guid = feed_subscriptions.guid AND feed_subscriptions.user_id = $1 AND tweets.guid = $2 AND status = 'canceled';"
	TweetsPost      = "UPDATE tweets SET status = 'posted', post_after = NULL, posted_at = CURRENT_TIMESTAMP, posted_tweet_id = $2 WHERE guid = $1 AND status <> 'posted';"
	TweetsCreate    = "INSERT INTO tweets (guid, feed_subscription_guid, post_after, post_guid, action, body, media_urls, retweet_id, position) SELECT v.guid, $1, $2, v.post_guid, v.action, v.body, ARRAY(SELECT json_array_elements_text(v.media_urls)), v.retweet_id, v.position FROM __unnested__ v(guid, post_guid, action, body, media_urls, retweet_id, position);"
	TweetsUpdate    = "UPDATE tweets SET action = v.action, body = v.body, media_urls = v.media_urls, retweet_id = v.retweet_id, updated_at = CURRENT_TIMESTAMP FROM ( SELECT v.guid, v.action, v.body, ARRAY(SELECT json_array_elements_text(v.media_urls)) AS media_urls, v.retweet_id FROM __unnested__ v(guid, action, body, media_urls, retweet_id) ) v WHERE tweets.guid = v.guid;"
)