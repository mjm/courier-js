package queries

const (
	// feed_subscriptions.sql
	FeedSubscriptionsByFeedID = "SELECT guid, feed_guid, user_id, autopost FROM feed_subscriptions WHERE feed_guid = $1;"
	FeedSubscriptionsGet      = "SELECT guid, feed_guid, user_id, autopost FROM feed_subscriptions WHERE	guid = $1;"

	// fixtures.sql
	FixturesExample = "INSERT INTO feeds (guid, url) VALUES ('46c2aa85-5124-40c1-896d-1e2ca4eb8587', 'https://example.com/feed.json'); INSERT INTO feed_subscriptions (guid, feed_guid, user_id, autopost) VALUES ('e9749df4-56d3-4716-a78f-2c00c38b9bdb', '46c2aa85-5124-40c1-896d-1e2ca4eb8587', 'test_user', FALSE); INSERT INTO posts (guid, feed_guid, item_id, text_content, html_content, title, url, published_at, modified_at) VALUES ('4a5fc152-1b2a-40eb-969f-8b1473cd28f2', '46c2aa85-5124-40c1-896d-1e2ca4eb8587', 'https://example.com/item-1', '', '<p>This is my first example post</p>', '', 'https://example.com/item-1', '2020-01-01 12:00:00', '2020-01-01 12:00:00'), ('f536e1b2-ddaa-49fa-97e7-6065714660a3', '46c2aa85-5124-40c1-896d-1e2ca4eb8587', 'https://example.com/item-2', '', '<p>This is a second example post</p>', 'A Titled Post', 'https://example.com/item-2', '2020-01-01 13:00:00', '2020-01-01 13:00:00');"

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
