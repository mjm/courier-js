-- qry: TweetsGet
SELECT
  t.*
FROM
  tweets t
  JOIN feed_subscriptions fs ON t.feed_subscription_guid = fs.guid
WHERE fs.user_id = $1
  AND t.guid = $2;

-- qry: TweetsPost
UPDATE tweets
SET
  status          = 'posted',
  post_after      = NULL,
  posted_at       = CURRENT_TIMESTAMP,
  posted_tweet_id = $2
WHERE guid = $1
  AND status = 'draft';

-- qry: TweetsQueuePost
UPDATE tweets
SET
  post_after     = CURRENT_TIMESTAMP,
  post_task_name = $2,
  updated_at     = CURRENT_TIMESTAMP
WHERE guid = $1
  AND status = 'draft';

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
      ARRAY(SELECT json_array_elements_text(v.media_urls)) AS media_urls,
      v.retweet_id
    FROM
      __unnested__ v(guid, action, body, media_urls, retweet_id)
  ) v
WHERE tweets.guid = v.guid;
