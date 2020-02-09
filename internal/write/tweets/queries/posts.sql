-- qry: PostsByIDs
SELECT
  id,
  item_id,
  text_content,
  html_content,
  title,
  url,
  published_at,
  modified_at
FROM
  posts
WHERE id = ANY ($1);

-- qry: PostsRecent
SELECT
  id,
  item_id,
  text_content,
  html_content,
  title,
  url,
  published_at,
  modified_at
FROM
  posts
WHERE feed_id = $1
ORDER BY
  published_at DESC
LIMIT 10;
