-- qry: SubscriptionsCreate
INSERT INTO
  feed_subscriptions
  (guid, user_id, feed_guid)
VALUES
  ($1, $2, $3)
ON CONFLICT
  (feed_guid, user_id)
  DO UPDATE
  SET
    discarded_at = NULL
RETURNING guid;

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
