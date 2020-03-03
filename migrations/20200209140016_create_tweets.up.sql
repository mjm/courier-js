BEGIN;

CREATE TYPE tweet_status AS enum ('draft', 'canceled', 'posted');

CREATE TABLE tweets
(
  id                   serial PRIMARY KEY,
  post_id              bigint       NOT NULL REFERENCES posts (id) ON DELETE RESTRICT,
  feed_subscription_id bigint       NOT NULL REFERENCES feed_subscriptions (id) ON DELETE RESTRICT,
  body                 text         NOT NULL DEFAULT '',
  media_urls           text[]       NOT NULL DEFAULT ARRAY []::text[],
  status               tweet_status NOT NULL DEFAULT 'draft'::tweet_status,
  posted_at            timestamp,
  posted_tweet_id      text         NOT NULL DEFAULT '',
  position             integer      NOT NULL DEFAULT 0,
  created_at           timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX tweets_post_id_index
  ON tweets (post_id);

CREATE INDEX tweets_feed_subscription_id_index
  ON tweets (feed_subscription_id);

COMMIT;
