BEGIN;

ALTER TABLE posts
  DROP COLUMN feed_guid;
ALTER TABLE feed_subscriptions
  DROP COLUMN feed_guid;
ALTER TABLE feeds
  DROP COLUMN guid;

COMMIT;
