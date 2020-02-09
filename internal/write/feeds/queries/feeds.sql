-- qry: FeedsGet
SELECT *
FROM
  feeds
WHERE id = $1;

-- qry: FeedsGetByURL
SELECT *
FROM
  feeds
WHERE url = $1;

-- qry: FeedsCreate
INSERT INTO
  feeds
  (url)
VALUES
  ($1)
RETURNING id;

-- qry: FeedsUpdate
UPDATE
  feeds
SET
  title           = $1,
  home_page_url   = $2,
  caching_headers = $3,
  mp_endpoint     = $4,
  refreshed_at    = CURRENT_TIMESTAMP,
  updated_at      = CURRENT_TIMESTAMP
WHERE id = $5
RETURNING *;
