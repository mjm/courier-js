BEGIN;

CREATE TABLE device_tokens
(
  id         serial PRIMARY KEY,
  user_id    text      NOT NULL,
  token      text      NOT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX device_tokens_user_id_index
  ON device_tokens (user_id);

CREATE UNIQUE INDEX device_tokens_user_id_token_unique_index
  ON device_tokens (user_id, token);

COMMIT;
