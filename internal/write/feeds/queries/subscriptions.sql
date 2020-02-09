-- qry: SubscriptionsCreate
INSERT INTO
  feed_subscriptions
  (user_id, feed_id)
VALUES
  ($1, $2)
ON CONFLICT
  (feed_id, user_id)
  DO UPDATE
  SET
    discarded_at = NULL
RETURNING id;

-- qry: SubscriptionsDeactivate
UPDATE
  feed_subscriptions
SET
  discarded_at = CURRENT_TIMESTAMP
WHERE user_id = $1
  AND id = $2;
