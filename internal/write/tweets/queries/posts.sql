-- qry: PostsMicropubEndpoint
SELECT
  posts.url,
  feeds.home_page_url,
  feeds.mp_endpoint
FROM
  posts
  JOIN feeds ON posts.feed_guid = feeds.guid
WHERE posts.guid = $1;
