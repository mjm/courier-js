-- qry: FeedsLoad
SELECT *
FROM
  feeds
WHERE guid = ANY ($1);
