-- qry: FixturesExample
INSERT INTO
  feeds
  (guid, url)
VALUES
  ('46c2aa85-5124-40c1-896d-1e2ca4eb8587', 'https://example.com/feed.json');

INSERT INTO
  feed_subscriptions
  (guid, feed_guid, user_id, autopost)
VALUES
  ('e9749df4-56d3-4716-a78f-2c00c38b9bdb', '46c2aa85-5124-40c1-896d-1e2ca4eb8587', 'test_user', FALSE),
  ('b51070d3-81f3-45f0-81f5-0811ea62b80f', '46c2aa85-5124-40c1-896d-1e2ca4eb8587', 'test_user2', TRUE),
  ('4b033437-c2a8-4775-b303-2764f2d73c31', '46c2aa85-5124-40c1-896d-1e2ca4eb8587', 'test_user3', FALSE);