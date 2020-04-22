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
