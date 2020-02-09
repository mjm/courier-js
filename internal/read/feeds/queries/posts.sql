-- qry: PostsLoad
SELECT *
FROM
  posts
WHERE id = ANY ($1);
