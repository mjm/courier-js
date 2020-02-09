-- qry: FeedsLoad
SELECT *
FROM
  feeds
WHERE id = ANY ($1);
