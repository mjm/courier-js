import { UserId, Tweet, TweetId } from "./types"
import db, { sql } from "../db"
import { postToTwitter } from "../twitter"
import * as table from "./dbTypes"

export async function getTweetsToPost() {
  const rows = await db.any(sql<table.tweets>`
    SELECT *
      FROM tweets
     WHERE post_after IS NOT NULL
       AND post_after < CURRENT_TIMESTAMP
       AND status = 'draft'
  ORDER BY post_after ASC
  `)

  return rows.map(fromRow)
}

export async function postQueuedTweet(tweet: Tweet): Promise<void> {
  // look up the user ID since we won't know it ahead of time
  const userId = await db.oneFirst(sql<
    Pick<table.feed_subscriptions, "user_id">
  >`
    SELECT feed_subscriptions.user_id
      FROM tweets
      JOIN feed_subscriptions
        ON tweets.feed_subscription_id = feed_subscriptions.id
     WHERE tweets.id = ${tweet.id}
  `)

  await doPostTweet(userId, tweet)
}

async function doPostTweet(userId: UserId, tweet: Tweet): Promise<Tweet> {
  const postedTweetID = await postToTwitter({ userId, tweet })

  const row = await db.maybeOne(sql<table.tweets>`
    UPDATE tweets
       SET status = 'posted',
           post_after = NULL,
           posted_at = CURRENT_TIMESTAMP,
           posted_tweet_id = ${postedTweetID}
     WHERE id = ${tweet.id}
       AND status <> 'posted'
 RETURNING *
  `)

  if (!row) {
    // another request squeezed in between our initial fetch and our update.
    // this is probably fine: Twitter silently rejects duplicate posts that are
    // close together.
    // just refetch the tweet and return that as if we did it here.
    return await getTweet(userId, tweet.id)
  }

  return fromRow(row)
}

async function getTweet(userId: UserId, id: TweetId): Promise<Tweet> {
  const row = await db.one(sql<table.tweets>`
    SELECT tweets.*
      FROM tweets
      JOIN feed_subscriptions
        ON tweets.feed_subscription_id = feed_subscriptions.id
      WHERE tweets.id = ${id}
        AND feed_subscriptions.user_id = ${userId}
  `)
  return fromRow(row)
}

function fromRow({
  id,
  post_id,
  feed_subscription_id,
  body,
  media_urls,
  status,
  post_after,
  posted_at,
  posted_tweet_id,
}: table.tweets): Tweet {
  return {
    id: id.toString(),
    feedSubscriptionId: feed_subscription_id.toString(),
    postId: post_id.toString(),
    body,
    mediaURLs: media_urls,
    status,
    postAfter: post_after,
    postedAt: posted_at,
    postedTweetID: posted_tweet_id,
  }
}
