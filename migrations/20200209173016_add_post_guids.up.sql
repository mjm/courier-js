BEGIN;

ALTER TABLE posts
  ADD COLUMN guid uuid NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE tweets
  ADD COLUMN post_guid uuid;

CREATE UNIQUE INDEX posts_guid_unique_index
  ON posts (guid);

UPDATE tweets
SET
  post_guid = v.guid
FROM
  (SELECT id, guid FROM posts) v
WHERE tweets.post_id = v.id;

ALTER TABLE tweets
  ALTER COLUMN post_guid SET NOT NULL,
  ALTER COLUMN post_id DROP NOT NULL,
  ADD CONSTRAINT tweets_post_guid_fkey FOREIGN KEY (post_guid) REFERENCES posts (guid) ON DELETE RESTRICT;

CREATE INDEX tweets_post_guid_index
  ON tweets (post_guid);

COMMIT;
