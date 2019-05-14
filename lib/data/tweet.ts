import {
  UserId,
  PagingOptions,
  Tweet,
  TweetStatus,
  ImportTweetsInput,
  FeedSubscriptionId,
  PostId,
  NewTweetInput,
  UpdateTweetInput,
  TweetId,
} from "./types"
import { Pager } from "./pager"
import moment from "moment"
import { PostRow, fromRow as fromPostRow } from "./post"
import { translate } from "html-to-tweets"
import db, { sql } from "../db"
import zip from "lodash/zip"
import { ValueExpressionType } from "slonik"

const tweetSelect = sql`
       tweets.*,
       posts.feed_id,
       posts.item_id,
       posts.text_content,
       posts.html_content,
       posts.title,
       posts.url,
       posts.published_at,
       posts.modified_at,
       posts.created_at AS post_created_at,
       posts.updated_at AS post_updated_at
  FROM tweets
  JOIN posts
    ON tweets.post_id = posts.id
`

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
      SELECT ${tweetSelect}
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
      results.push(updatedTweet)
    }
  }

  return results
}

async function getTweetsForPost(
  feedSubscriptionId: FeedSubscriptionId,
  postId: PostId
): Promise<Tweet[]> {
  const rows = await db.any(sql<TweetRow>`
    SELECT ${tweetSelect}
     WHERE feed_subscription_id = ${feedSubscriptionId}
       AND post_id = ${postId}
  ORDER BY position
  `)

  return rows.map(fromRow)
}

async function createTweet(input: NewTweetInput): Promise<Tweet> {
  const id = await db.oneFirst(sql<Pick<TweetRow, "id">>`
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
    RETURNING id
  `)

  return await getTweet(id)
}

async function updateTweet(input: UpdateTweetInput): Promise<Tweet> {
  await db.query(sql`
    UPDATE tweets
       SET body = ${input.body},
           media_urls = ${sql.array(input.mediaURLs, "text")}
     WHERE id = ${input.id}
       AND status <> 'posted'
  `)

  return await getTweet(input.id)
}

async function getTweet(id: TweetId): Promise<Tweet> {
  const row = await db.one(sql<TweetRow>`
    SELECT ${tweetSelect}
     WHERE tweets.id = ${id}
  `)

  return fromRow(row)
}

interface TweetRow extends PostRow {
  post_id: string
  feed_subscription_id: string
  body: string
  media_urls: string[]
  status: TweetStatus
  posted_at: Date | null
  posted_tweet_id: string
  position: number

  post_created_at: Date
  post_updated_at: Date
}

function fromRow({
  id,
  post_id,
  feed_subscription_id,
  body,
  media_urls,
  status,
  posted_at,
  posted_tweet_id,

  // ignored at the moment, but this prevents it from being included in the rest spread
  position,

  created_at,
  updated_at,
  post_created_at,
  post_updated_at,
  ...rest
}: TweetRow): Tweet {
  return {
    id,
    feedSubscriptionId: feed_subscription_id,
    body,
    mediaURLs: media_urls,
    status,
    postedAt: posted_at,
    postedTweetID: posted_tweet_id,
    post: fromPostRow({
      id: post_id,
      created_at: post_created_at,
      updated_at: post_updated_at,
      ...rest,
    }),
  }
}
