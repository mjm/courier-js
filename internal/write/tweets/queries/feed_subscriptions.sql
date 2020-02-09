-- qry: FeedSubscriptionsByFeedID
SELECT
  id,
  feed_guid,
  user_id,
  autopost
FROM
  feed_subscriptions
WHERE feed_guid = $1;

-- qry: FeedSubscriptionsGet
SELECT
  id,
  feed_guid,
  user_id,
  autopost
FROM
  feed_subscriptions
WHERE	id = $1;
