-- qry: PostsByIDs
SELECT
  guid,
  item_id,
  text_content,
  html_content,
  title,
  url,
  published_at,
  modified_at
FROM
  posts
WHERE guid = ANY ($1);

-- qry: PostsRecent
SELECT
  guid,
  item_id,
  text_content,
  html_content,
  title,
  url,
  published_at,
  modified_at
FROM
  posts
WHERE feed_guid = $1
ORDER BY
  published_at DESC
LIMIT 10;
