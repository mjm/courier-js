BEGIN;

CREATE TABLE posts
(
  id           serial PRIMARY KEY,
  feed_id      bigint    NOT NULL REFERENCES feeds (id) ON DELETE CASCADE,
  item_id      text      NOT NULL,
  text_content text      NOT NULL DEFAULT '',
  html_content text      NOT NULL DEFAULT '',
  title        text      NOT NULL DEFAULT '',
  url          text      NOT NULL DEFAULT '',
  published_at timestamp,
  modified_at  timestamp,
  created_at   timestamp NOT NULL DEFAULT current_timestamp,
  updated_at   timestamp NOT NULL DEFAULT current_timestamp
);

CREATE UNIQUE INDEX posts_feed_id_item_id_unique_index ON posts (feed_id, item_id);
CREATE INDEX posts_feed_id_index ON posts (feed_id);

COMMIT;
