BEGIN;

ALTER TABLE tweets
  DROP COLUMN action,
  DROP COLUMN retweet_id;

DROP TYPE tweet_action;

COMMIT;
