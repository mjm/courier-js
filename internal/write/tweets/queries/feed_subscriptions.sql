-- qry: FeedSubscriptionsByFeedID
SELECT
  guid,
  feed_guid,
  user_id,
  autopost
FROM
  feed_subscriptions
WHERE feed_guid = $1;

-- qry: FeedSubscriptionsGet
SELECT
  guid,
  feed_guid,
  user_id,
  autopost
FROM
  feed_subscriptions
WHERE	guid = $1;
