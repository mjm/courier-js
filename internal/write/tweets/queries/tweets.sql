-- qry: TweetsByPostIDs
SELECT *
FROM
  tweets
WHERE feed_subscription_guid = $1
  AND post_guid = ANY ($2)
ORDER BY
  post_guid,
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
WHERE tweets.feed_subscription_guid = feed_subscriptions.guid
  AND feed_subscriptions.user_id = $1
  AND tweets.guid = $2
  AND status <> 'posted';

-- qry: TweetsCreate
INSERT INTO
  tweets
  (guid,
   feed_subscription_guid,
   post_after,
   post_guid,
   action,
   body,
   media_urls,
   retweet_id,
   position)
SELECT
  v.guid,
  $1,
  $2,
  v.post_guid,
  v.action,
  v.body,
  ARRAY(SELECT json_array_elements_text(v.media_urls)),
  v.retweet_id,
  v.position
FROM
  __unnested__ v(guid, post_guid, action, body, media_urls, retweet_id, position);

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
      v.guid,
      v.action,
      v.body,
      ARRAY(SELECT json_array_elements_text(v.media_urls)),
      v.retweet_id
    FROM
      __unnested__ v(guid, action, body, media_urls, retweet_id)
  ) v
WHERE tweets.guid = v.guid;
