BEGIN;

CREATE TABLE feeds
(
  id              serial PRIMARY KEY,
  url             text      NOT NULL,
  title           text      NOT NULL DEFAULT '',
  home_page_url   text      NOT NULL DEFAULT '',
  refreshed_at    timestamp,
  created_at      timestamp NOT NULL DEFAULT current_timestamp,
  updated_at      timestamp NOT NULL DEFAULT current_timestamp,
  caching_headers jsonb
);

CREATE UNIQUE INDEX feeds_url_unique_index ON feeds (url);

COMMIT;
