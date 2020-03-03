-- qry: FeedsLoad
SELECT *
FROM
  feeds
WHERE guid = ANY ($1);

-- qry: FeedsByHomePageURL
SELECT *
FROM
  feeds
WHERE home_page_url = $1;
