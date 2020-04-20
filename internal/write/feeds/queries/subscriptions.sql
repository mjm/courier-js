-- qry: SubscriptionsDeactivate
UPDATE
  feed_subscriptions
SET
  discarded_at = CURRENT_TIMESTAMP
WHERE user_id = $1
  AND guid = $2;
