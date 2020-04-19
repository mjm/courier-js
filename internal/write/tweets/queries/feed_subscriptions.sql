-- qry: FeedSubscriptionsGet
SELECT
  guid,
  feed_guid,
  user_id,
  autopost
FROM
  feed_subscriptions
WHERE guid = $1;
