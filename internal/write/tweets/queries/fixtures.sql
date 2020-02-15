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

INSERT INTO
  posts
  (guid, feed_guid, item_id, text_content, html_content, title, url, published_at, modified_at)
VALUES
  ('4a5fc152-1b2a-40eb-969f-8b1473cd28f2', '46c2aa85-5124-40c1-896d-1e2ca4eb8587', 'https://example.com/item-1', '',
   '<p>This is my first example post</p>', '', 'https://example.com/item-1', '2020-01-01 12:00:00',
   '2020-01-01 12:00:00'),
  ('f536e1b2-ddaa-49fa-97e7-6065714660a3', '46c2aa85-5124-40c1-896d-1e2ca4eb8587', 'https://example.com/item-2', '',
   '<p>This is a second example post</p>', 'A Titled Post', 'https://example.com/item-2', '2020-01-01 13:00:00',
   '2020-01-01 13:00:00'),
  ('4d18e711-0d6e-4725-91f9-02b64a88067b', '46c2aa85-5124-40c1-896d-1e2ca4eb8587', 'https://example.com/item-3', '',
   '<p>Lorem ipsum</p>', 'A Titled Post', 'https://example.com/item-3', '2020-01-01 10:00:00',
   '2020-01-01 10:00:00');

INSERT INTO
  tweets
  (guid, feed_subscription_guid, post_guid, body, media_urls, status, action, posted_at, posted_tweet_id)
VALUES
  ('df850b2a-a4c1-4e51-95ea-5e0ad456310f', 'e9749df4-56d3-4716-a78f-2c00c38b9bdb',
   '4a5fc152-1b2a-40eb-969f-8b1473cd28f2', 'This is my first example post', '{}'::text[], 'draft', 'tweet', NULL, ''),
  ('ea2f9dc0-8701-485e-9b2b-0d9b9e7d244f', '4b033437-c2a8-4775-b303-2764f2d73c31',
   '4a5fc152-1b2a-40eb-969f-8b1473cd28f2', 'This is my first example post', '{}'::text[], 'canceled', 'tweet', NULL,
   ''),
  ('7f297943-854e-4e59-abe2-b377fde9aa12', '4b033437-c2a8-4775-b303-2764f2d73c31',
   'f536e1b2-ddaa-49fa-97e7-6065714660a3', 'A Titled Post https://example.com/item-2', '{}'::text[], 'posted', 'tweet',
   '2020-01-03 04:00:00', '1234567890'),
  ('398042cc-d2f6-4d91-bd81-a5a4f19f7746', '4b033437-c2a8-4775-b303-2764f2d73c31',
   '4d18e711-0d6e-4725-91f9-02b64a88067b', 'This is my first example post', '{}'::text[], 'draft', 'tweet', NULL, '');
