-- qry: TweetsLoad
SELECT
  tweets.*
FROM
  tweets
  JOIN feed_subscriptions ON tweets.feed_subscription_id = feed_subscriptions.id
WHERE feed_subscriptions.user_id = $1
  AND tweets.id = ANY ($2);

-- qry: TweetsPagerEdges
SELECT
  tweets.*,
  posts.published_at
FROM
  tweets
  JOIN posts
       ON tweets.post_id = posts.id
  JOIN feed_subscriptions
       ON tweets.feed_subscription_id = feed_subscriptions.id
WHERE feed_subscriptions.user_id = :user_id
  AND __condition__;

-- qry: TweetsPagerTotal
SELECT
  COUNT(*)
FROM
  tweets
  JOIN feed_subscriptions
       ON tweets.feed_subscription_id = feed_subscriptions.id
WHERE feed_subscriptions.user_id = :user_id
  AND __condition__;
