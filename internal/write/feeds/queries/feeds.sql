-- qry: FeedsGetByURL
SELECT *
FROM
  feeds
WHERE url = $1;

-- qry: FeedsCreate
INSERT INTO
  feeds
  (guid, url)
VALUES
  ($1, $2)
RETURNING id;
