-- qry: PostsByItemIDs
SELECT *
FROM
  posts
WHERE feed_guid = $1
  AND item_id = ANY ($2);

-- noinspection SqlInsertValues
-- qry: PostsCreate
INSERT INTO
  posts
  (feed_guid,
   item_id,
   url,
   title,
   text_content,
   html_content,
   published_at,
   modified_at)
SELECT *
FROM
  __unnested__
RETURNING *;

-- qry: PostsUpdate
UPDATE
  posts
SET
  url          = v.url,
  title        = v.title,
  text_content = v.text_content,
  html_content = v.html_content,
  published_at = v.published_at,
  modified_at  = v.modified_at,
  updated_at   = CURRENT_TIMESTAMP
FROM
  (
    SELECT *
    FROM
      __unnested__
  ) v(id, url, title, text_content, html_content, published_at, modified_at)
WHERE posts.id = v.id
RETURNING *;
