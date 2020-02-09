-- qry: TweetsByPostIDs
SELECT *
FROM
  tweets
WHERE feed_subscription_id = $1
  AND post_id = ANY ($2)
ORDER BY
  post_id,
  position;

-- qry: TweetsCancel
UPDATE
  tweets
SET
  status     = 'canceled',
  post_after = NULL,
  updated_at = CURRENT_TIMESTAMP
FROM
  feed_subscriptions
WHERE tweets.feed_subscription_id = feed_subscriptions.id
  AND feed_subscriptions.user_id = $1
  AND tweets.id = $2
  AND status <> 'posted';

-- qry: TweetsCreate
INSERT INTO
  tweets
  (feed_subscription_id,
   post_after,
   post_id,
   action,
   body,
   media_urls,
   retweet_id,
   position)
SELECT
  $1,
  $2,
  v.post_id,
  v.action,
  v.body,
  ARRAY(SELECT json_array_elements_text(v.media_urls)),
  v.retweet_id,
  v.position
FROM
  __unnested__ v(post_id, action, body, media_urls, retweet_id, position)
RETURNING id;

-- qry: TweetsUpdate
UPDATE
  tweets
SET
  action     = v.action,
  body       = v.body,
  media_urls = v.media_urls,
  retweet_id = v.retweet_id,
  updated_at = CURRENT_TIMESTAMP
FROM
  (
    SELECT
      v.id,
      v.action,
      v.body,
      ARRAY(SELECT json_array_elements_text(v.media_urls)),
      v.retweet_id
    FROM
      __unnested__ v(id, action, body, media_urls, retweet_id)
  ) v
WHERE posts.id = v.id;
