-- qry: TweetsLoad
SELECT
  tweets.*
FROM
  tweets
  JOIN feed_subscriptions ON tweets.feed_subscription_guid = feed_subscriptions.guid
WHERE feed_subscriptions.user_id = $1
  AND tweets.guid = ANY ($2);

-- qry: TweetsPagerEdges
SELECT
  tweets.*,
  posts.published_at
FROM
  tweets
  JOIN posts
       ON tweets.post_guid = posts.guid
  JOIN feed_subscriptions
       ON tweets.feed_subscription_guid = feed_subscriptions.guid
WHERE feed_subscriptions.user_id = :user_id
  AND __condition__;

-- qry: TweetsPagerTotal
SELECT
  COUNT(*)
FROM
  tweets
  JOIN feed_subscriptions
       ON tweets.feed_subscription_guid = feed_subscriptions.guid
WHERE feed_subscriptions.user_id = :user_id
  AND __condition__;
