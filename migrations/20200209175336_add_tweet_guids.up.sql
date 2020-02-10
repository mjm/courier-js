BEGIN;

ALTER TABLE tweets
  ADD COLUMN guid uuid NOT NULL DEFAULT gen_random_uuid();

CREATE UNIQUE INDEX tweets_guid_unique_index
  ON tweets (guid);

COMMIT;
