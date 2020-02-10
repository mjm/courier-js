-- qry: SubscriptionsLoad
SELECT *
FROM
  feed_subscriptions
WHERE user_id = $1
  AND guid = ANY ($2);

-- qry: SubscriptionsGetEdge
SELECT
  feed_subscriptions.*,
  feeds.url
FROM
  feed_subscriptions
  JOIN feeds ON feed_subscriptions.feed_guid = feeds.guid
WHERE feed_subscriptions.guid = $1;

-- qry: SubscriptionsPagerEdges
SELECT
  feed_subscriptions.*,
  feeds.url
FROM
  feed_subscriptions
  JOIN feeds ON feed_subscriptions.feed_guid = feeds.guid
WHERE user_id = :user_id
  AND discarded_at IS NULL;

-- qry: SubscriptionsPagerTotal
SELECT
  COUNT(*)
FROM
  feed_subscriptions
WHERE user_id = :user_id
  AND discarded_at IS NULL;
