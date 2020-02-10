-- qry: PostsLoad
SELECT *
FROM
  posts
WHERE guid = ANY ($1);
