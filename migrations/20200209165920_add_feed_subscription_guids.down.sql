BEGIN;

ALTER TABLE tweets
  DROP COLUMN feed_subscription_guid;
ALTER TABLE feed_subscriptions
  DROP COLUMN guid;

COMMIT;
