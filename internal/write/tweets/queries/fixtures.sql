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
  ('e9749df4-56d3-4716-a78f-2c00c38b9bdb', '46c2aa85-5124-40c1-896d-1e2ca4eb8587', 'test_user', FALSE);

INSERT INTO
  posts
  (guid, feed_guid, item_id, text_content, html_content, title, url, published_at, modified_at)
VALUES
  ('4a5fc152-1b2a-40eb-969f-8b1473cd28f2', '46c2aa85-5124-40c1-896d-1e2ca4eb8587', 'https://example.com/item-1', '',
   '<p>This is my first example post</p>', '', 'https://example.com/item-1', '2020-01-01 12:00:00',
   '2020-01-01 12:00:00'),
  ('f536e1b2-ddaa-49fa-97e7-6065714660a3', '46c2aa85-5124-40c1-896d-1e2ca4eb8587', 'https://example.com/item-2', '',
   '<p>This is a second example post</p>', 'A Titled Post', 'https://example.com/item-2', '2020-01-01 13:00:00',
   '2020-01-01 13:00:00');
