-- qry: FeedSubscriptionsByFeedID
SELECT
  id,
  feed_id,
  user_id,
  autopost
FROM
  feed_subscriptions
WHERE feed_id = $1;

-- qry: FeedSubscriptionsGet
SELECT
  id,
  feed_id,
  user_id,
  autopost
FROM
  feed_subscriptions
WHERE	id = $1;
