BEGIN;

CREATE TYPE tweet_action AS enum ('tweet', 'retweet');

ALTER TABLE tweets
  ADD COLUMN action     tweet_action NOT NULL DEFAULT 'tweet',
  ADD COLUMN retweet_id text         NOT NULL DEFAULT '';

COMMIT;
