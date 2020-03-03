-- qry: PostsLoad
SELECT *
FROM
  posts
WHERE guid = ANY ($1);

-- qry: PostsPagerEdges
SELECT *
FROM
  posts
WHERE feed_guid = :feed_id;

-- qry: PostsPagerTotal
SELECT
  COUNT(*)
FROM
  posts
WHERE feed_guid = :feed_id;
