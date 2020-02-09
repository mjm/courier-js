BEGIN;

CREATE TABLE events
(
  id         serial PRIMARY KEY,
  user_id    text,
  event_type text      NOT NULL,
  parameters jsonb     NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX events_created_at_index
  ON events (created_at);

CREATE INDEX events_user_id_created_at_index
  ON events (user_id, created_at);

COMMIT;
