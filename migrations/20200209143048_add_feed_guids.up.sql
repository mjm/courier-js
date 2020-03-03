BEGIN;

ALTER TABLE feeds
  ADD COLUMN guid uuid NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE posts
  ADD COLUMN feed_guid uuid;
ALTER TABLE feed_subscriptions
  ADD COLUMN feed_guid uuid;

CREATE UNIQUE INDEX feeds_guid_unique_index
  ON feeds (guid);

UPDATE posts
SET
  feed_guid = v.guid
FROM
    (SELECT id, guid FROM feeds) v
WHERE posts.feed_id = v.id;

UPDATE feed_subscriptions
SET
  feed_guid = v.guid
FROM
    (SELECT id, guid FROM feeds) v
WHERE feed_subscriptions.feed_id = v.id;

ALTER TABLE posts
  ALTER COLUMN feed_guid SET NOT NULL,
  ALTER COLUMN feed_id DROP NOT NULL,
  ADD CONSTRAINT posts_feed_guid_fkey FOREIGN KEY (feed_guid) REFERENCES feeds (guid) ON DELETE CASCADE;

CREATE INDEX posts_feed_guid_index
  ON posts (feed_guid);

CREATE UNIQUE INDEX posts_feed_guid_item_id_unique_index
  ON posts (feed_guid, item_id);

ALTER TABLE feed_subscriptions
  ALTER COLUMN feed_guid SET NOT NULL,
  ALTER COLUMN feed_id DROP NOT NULL,
  ADD CONSTRAINT feed_subscriptions_feed_guid_fkey FOREIGN KEY (feed_guid) REFERENCES feeds (guid) ON DELETE CASCADE;

CREATE INDEX feed_subscriptions_feed_guid_index
  ON feed_subscriptions (feed_guid);

CREATE UNIQUE INDEX feed_subscriptions_feed_guid_user_id_unique_index
  ON feed_subscriptions (feed_guid, user_id);

COMMIT;
