package queries

const (
	// feeds.sql
	FeedsGet      = "SELECT * FROM feeds WHERE guid = $1;"
	FeedsGetByURL = "SELECT * FROM feeds WHERE url = $1;"
	FeedsCreate   = "INSERT INTO feeds (guid, url) VALUES ($1, $2) RETURNING id;"
	FeedsUpdate   = "UPDATE feeds SET title = $1, home_page_url = $2, caching_headers = $3, mp_endpoint = $4, refreshed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE guid = $5 RETURNING *;"

	// fixtures.sql
	FixturesExample = "INSERT INTO feeds (guid, url) VALUES ('46c2aa85-5124-40c1-896d-1e2ca4eb8587', 'https://example.com/feed.json'); INSERT INTO feed_subscriptions (guid, feed_guid, user_id, autopost) VALUES ('e9749df4-56d3-4716-a78f-2c00c38b9bdb', '46c2aa85-5124-40c1-896d-1e2ca4eb8587', 'test_user', FALSE), ('b51070d3-81f3-45f0-81f5-0811ea62b80f', '46c2aa85-5124-40c1-896d-1e2ca4eb8587', 'test_user2', TRUE), ('4b033437-c2a8-4775-b303-2764f2d73c31', '46c2aa85-5124-40c1-896d-1e2ca4eb8587', 'test_user3', FALSE);"

	// posts.sql
	PostsByItemIDs = "SELECT * FROM posts WHERE feed_guid = $1 AND item_id = ANY ($2); -- noinspection SqlInsertValues"
	PostsCreate    = "INSERT INTO posts (guid, feed_guid, item_id, url, title, text_content, html_content, published_at, modified_at) SELECT * FROM __unnested__ RETURNING *;"
	PostsUpdate    = "UPDATE posts SET url = v.url, title = v.title, text_content = v.text_content, html_content = v.html_content, published_at = v.published_at, modified_at = v.modified_at, updated_at = CURRENT_TIMESTAMP FROM ( SELECT * FROM __unnested__ ) v(guid, url, title, text_content, html_content, published_at, modified_at) WHERE posts.guid = v.guid RETURNING *;"

	// subscriptions.sql
	SubscriptionsCreate     = "INSERT INTO feed_subscriptions (guid, user_id, feed_guid) VALUES ($1, $2, $3) ON CONFLICT (feed_guid, user_id) DO UPDATE SET discarded_at = NULL RETURNING guid;"
	SubscriptionsUpdate     = "UPDATE feed_subscriptions SET autopost = $3, updated_at = CURRENT_TIMESTAMP WHERE guid = $1 AND user_id = $2;"
	SubscriptionsDeactivate = "UPDATE feed_subscriptions SET discarded_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND guid = $2;"
)
