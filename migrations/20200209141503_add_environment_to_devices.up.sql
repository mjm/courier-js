ALTER TABLE device_tokens
  ADD COLUMN environment text NOT NULL DEFAULT 'SANDBOX';
