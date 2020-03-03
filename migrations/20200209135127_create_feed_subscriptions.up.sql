BEGIN;

CREATE TABLE feed_subscriptions
(
  id           serial PRIMARY KEY,
  feed_id      bigint    NOT NULL REFERENCES feeds (id) ON DELETE CASCADE,
  user_id      text      NOT NULL,
  autopost     bool      NOT NULL DEFAULT FALSE,
  created_at   timestamp NOT NULL DEFAULT current_timestamp,
  updated_at   timestamp NOT NULL DEFAULT current_timestamp,
  discarded_at timestamp
);

CREATE INDEX feed_subscriptions_feed_id_index
  ON feed_subscriptions (feed_id);
CREATE UNIQUE INDEX feed_subscriptions_feed_id_user_id_unique_index
  ON feed_subscriptions (feed_id, user_id);
CREATE INDEX feed_subscriptions_discarded_at_index
  ON feed_subscriptions (discarded_at);

COMMIT;
