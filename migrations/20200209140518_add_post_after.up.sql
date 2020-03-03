BEGIN;

ALTER TABLE tweets
  ADD COLUMN post_after timestamp;

CREATE INDEX tweets_post_after_index
  ON tweets (post_after);

COMMIT;
