-- qry: FeedSubscriptionsByFeedID
SELECT
  guid,
  feed_guid,
  user_id,
  autopost
FROM
  feed_subscriptions
WHERE feed_guid = $1
  AND discarded_at IS NULL;

-- qry: FeedSubscriptionsGet
SELECT
  guid,
  feed_guid,
  user_id,
  autopost
FROM
  feed_subscriptions
WHERE guid = $1;
