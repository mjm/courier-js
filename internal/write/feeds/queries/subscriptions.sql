-- qry: SubscriptionsUpdate
UPDATE
  feed_subscriptions
SET
  autopost   = $3,
  updated_at = CURRENT_TIMESTAMP
WHERE guid = $1
  AND user_id = $2;

-- qry: SubscriptionsDeactivate
UPDATE
  feed_subscriptions
SET
  discarded_at = CURRENT_TIMESTAMP
WHERE user_id = $1
  AND guid = $2;
