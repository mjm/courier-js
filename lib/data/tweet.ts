import {
  UserId,
  PagingOptions,
  Tweet,
  ImportTweetsInput,
  FeedSubscriptionId,
  PostId,
  NewTweetInput,
  UpdateTweetInput,
  TweetId,
} from "./types"
import { Pager } from "./pager"
import moment from "moment"
import { translate } from "html-to-tweets"
import db, { sql } from "../db"
import zip from "lodash/zip"
import { ValueExpressionType, NamedAssignmentType } from "slonik"
import { UserInputError } from "apollo-server-core"
import { postToTwitter } from "../twitter"
import * as table from "./dbTypes"

type TweetRow = table.tweets & Pick<table.posts, "published_at">

type AllTweetsOptions = PagingOptions & {
  filter?: "UPCOMING" | "PAST" | null
}

export function allTweets(
  userId: UserId,
  { filter, ...variables }: AllTweetsOptions = {}
): Pager<Tweet, TweetRow> {
  let filterCondition: ValueExpressionType = sql.raw("")
  if (filter) {
    const expr = sql.comparisonPredicate(
      sql.identifier(["tweets", "status"]),
      filter === "UPCOMING" ? "=" : "<>",
      "draft"
    )
    filterCondition = sql`AND ${expr}`
  }

  return new Pager({
    query: sql`
      SELECT tweets.*,
             posts.published_at
        FROM tweets
        JOIN posts
          ON tweets.post_id = posts.id
        JOIN feed_subscriptions
          ON tweets.feed_subscription_id = feed_subscriptions.id
       WHERE feed_subscriptions.user_id = ${userId}
         ${filterCondition}`,
    orderColumn: "published_at",
    totalQuery: sql`
      SELECT COUNT(*)
        FROM tweets
        JOIN feed_subscriptions
          ON tweets.feed_subscription_id = feed_subscriptions.id
       WHERE feed_subscriptions.user_id = ${userId}
         ${filterCondition}`,
    variables,
    makeEdge(row) {
      return {
        // TODO what about NULL published_at
        cursor: row.published_at ? moment.utc(row.published_at).format() : "",
        node: fromRow(row),
      }
    },
    getCursorValue(cursor) {
      return cursor || null
    },
  })
}

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

export async function importTweets({
  feedSubscriptionId,
  post,
}: ImportTweetsInput): Promise<Tweet[]> {
  // Generate the expected tweets
  const tweets = translate({
    url: post.url,
    title: post.title,
    html: post.htmlContent,
  })

  // Get the existing tweets for this post/subscription combo
  const existingTweets = await getTweetsForPost(feedSubscriptionId, post.id)

  // Either create or update as needed
  const zippedTweets = zip(tweets, existingTweets).map(
    ([nt, et], i) => [i, nt, et] as const
  )
  const results: Tweet[] = []
  for (let [i, tweet, existingTweet] of zippedTweets) {
    if (!existingTweet && tweet) {
      // we need to make a new tweet here
      const newTweet = await createTweet({
        feedSubscriptionId,
        postId: post.id,
        body: tweet.body,
        mediaURLs: tweet.mediaURLs,
        position: i,
      })
      results.push(newTweet)
    } else if (!tweet && existingTweet) {
      // we need to delete the tweet that already exists?
      // I'm not actually sure what to do here.
      results.push(existingTweet)
    } else if (tweet && existingTweet) {
      // we need to update the existing tweet if it hasn't been posted yet
      if (existingTweet.status === "posted") {
        results.push(existingTweet)
        continue
      }

      const updatedTweet = await updateTweet({
        id: existingTweet.id,
        body: tweet.body,
        mediaURLs: tweet.mediaURLs,
      })
      results.push(updatedTweet || existingTweet)
    }
  }

  return results
}

export async function cancelTweet(userId: UserId, id: TweetId): Promise<Tweet> {
  // this will ensure that we only do this for tweets that belong to the user
  const existingTweet = await getTweet(userId, id)

  const row = await db.maybeOne(sql<table.tweets>`
    UPDATE tweets
       SET status = 'canceled',
           updated_at = CURRENT_TIMESTAMP
     WHERE id = ${existingTweet.id}
       AND status <> 'posted'
 RETURNING *
  `)

  if (!row) {
    throw new UserInputError("An already posted tweet cannot be canceled.")
  }

  return fromRow(row)
}

export async function uncancelTweet(
  userId: UserId,
  id: TweetId
): Promise<Tweet> {
  // this will ensure that we only do this for tweets that belong to the user
  const existingTweet = await getTweet(userId, id)

  const row = await db.maybeOne(sql<table.tweets>`
    UPDATE tweets
       SET status = 'draft',
           updated_at = CURRENT_TIMESTAMP
     WHERE id = ${existingTweet.id}
       AND status = 'canceled'
 RETURNING *
  `)

  if (!row) {
    throw new UserInputError(
      `A ${existingTweet.status} tweet cannot be uncanceled.`
    )
  }

  return fromRow(row)
}

export async function postTweet(userId: UserId, id: TweetId): Promise<Tweet> {
  // this will ensure that we only do this for tweets that belong to the user
  const existingTweet = await getTweet(userId, id)
  if (existingTweet.status === "posted") {
    throw new UserInputError("A posted tweet cannot be posted again.")
  }

  return await doPostTweet(userId, existingTweet)
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

export async function editTweet(
  userId: UserId,
  input: UpdateTweetInput
): Promise<Tweet> {
  const existingTweet = await getTweet(userId, input.id)
  if (existingTweet.status !== "draft") {
    throw new UserInputError("Only a draft tweet can be edited.")
  }

  return (await updateTweet(input)) || existingTweet
}

async function getTweetsForPost(
  feedSubscriptionId: FeedSubscriptionId,
  postId: PostId
): Promise<Tweet[]> {
  const rows = await db.any(sql<table.tweets>`
    SELECT *
      FROM tweets
     WHERE feed_subscription_id = ${feedSubscriptionId}
       AND post_id = ${postId}
  ORDER BY position
  `)

  return rows.map(fromRow)
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

async function createTweet(input: NewTweetInput): Promise<Tweet> {
  const row = await db.one(sql<table.tweets>`
    INSERT INTO tweets (
      feed_subscription_id,
      post_id,
      body,
      media_urls,
      position
    ) VALUES (
      ${input.feedSubscriptionId},
      ${input.postId},
      ${input.body},
      ${sql.array(input.mediaURLs, "text")},
      ${input.position}
    )
    RETURNING *
  `)

  return fromRow(row)
}

async function updateTweet(input: UpdateTweetInput): Promise<Tweet | null> {
  const assignments: NamedAssignmentType = {
    body: input.body,
    updated_at: sql.raw("CURRENT_TIMESTAMP"),
  }
  if (input.mediaURLs) {
    assignments.media_urls = sql.array(input.mediaURLs, "text")
  }

  const row = await db.maybeOne(sql<table.tweets>`
    UPDATE tweets
       SET ${sql.assignmentList(assignments)}
     WHERE id = ${input.id}
       AND status <> 'posted'
 RETURNING *
  `)

  return row && fromRow(row)
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
