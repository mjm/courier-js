-- qry: SubscriptionsLoad
SELECT *
FROM
  feed_subscriptions
WHERE user_id = $1
  AND discarded_at IS NULL
  AND id = ANY ($2);

-- qry: SubscriptionsGetEdge
SELECT
  feed_subscriptions.*,
  feeds.url
FROM
  feed_subscriptions
  JOIN feeds ON feed_subscriptions.feed_id = feeds.id
WHERE feed_subscriptions.id = $1;

-- qry: SubscriptionsPagerEdges
SELECT
  feed_subscriptions.*,
  feeds.url
FROM
  feed_subscriptions
  JOIN feeds ON feed_subscriptions.feed_id = feeds.id
WHERE user_id = :user_id
  AND discarded_at IS NULL;

-- qry: SubscriptionsPagerTotal
SELECT
  COUNT(*)
FROM
  feed_subscriptions
WHERE user_id = :user_id
  AND discarded_at IS NULL;
