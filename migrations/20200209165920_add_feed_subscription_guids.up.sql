BEGIN;

ALTER TABLE feed_subscriptions
  ADD COLUMN guid uuid NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE tweets
  ADD COLUMN feed_subscription_guid uuid;

CREATE UNIQUE INDEX feed_subscriptions_guid_unique_index
  ON feed_subscriptions (guid);

UPDATE tweets
SET
  feed_subscription_guid = v.guid
FROM
    (SELECT id, guid FROM feed_subscriptions) v
WHERE tweets.feed_subscription_id = v.id;

ALTER TABLE tweets
  ALTER COLUMN feed_subscription_guid SET NOT NULL,
  ALTER COLUMN feed_subscription_id DROP NOT NULL,
  ADD CONSTRAINT tweets_feed_subscription_guid_fkey FOREIGN KEY (feed_subscription_guid) REFERENCES feed_subscriptions (guid) ON DELETE CASCADE;

CREATE INDEX tweets_feed_subscription_guid_index
  ON tweets (feed_subscription_guid);

COMMIT;
