import {
  sql,
  DatabasePoolType,
  NamedAssignmentType,
  ValueExpressionType,
} from "../db"
import * as table from "../data/dbTypes"
import { getByIds } from "../data/util"
import DataLoader from "dataloader"
import {
  UserId,
  PagingOptions,
  Tweet,
  TweetId,
  UpdateTweetInput,
  NewTweetInput,
  FeedSubscriptionId,
  PostId,
} from "../data/types"
import { Pager } from "../data/pager"
import moment from "moment"

type TweetRow = table.tweets & Pick<table.posts, "published_at">
export type TweetPagingOptions = PagingOptions & {
  filter?: "UPCOMING" | "PAST" | null
}

export type TweetLoader = DataLoader<TweetId, Tweet | null>

class TweetRepository {
  constructor(private db: DatabasePoolType) {}

  paged(
    userId: UserId,
    { filter, ...variables }: TweetPagingOptions = {}
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
      db: this.db,
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
          node: TweetRepository.fromRow(row),
        }
      },
      getCursorValue(cursor) {
        return cursor || null
      },
    })
  }

  createLoader(userId: UserId | null): TweetLoader {
    return new DataLoader(async ids => {
      return await getByIds({
        db: this.db,
        query: cond =>
          userId
            ? sql`
          SELECT *
            FROM tweets
            JOIN feed_subscriptions
              ON tweets.feed_subscription_id = feed_subscriptions.id
           WHERE feed_subscriptions.user_id = ${userId}
             AND ${cond("tweets")}
        `
            : sql`
          SELECT *
            FROM tweets
           WHERE ${cond("tweets")}
        `,
        ids,
        fromRow: TweetRepository.fromRow,
      })
    })
  }

  async findAllByPost(
    feedSubscriptionId: FeedSubscriptionId,
    postId: PostId
  ): Promise<Tweet[]> {
    const rows = await this.db.any(sql<table.tweets>`
      SELECT *
        FROM tweets
       WHERE feed_subscription_id = ${feedSubscriptionId}
         AND post_id = ${postId}
    ORDER BY position
    `)

    return rows.map(TweetRepository.fromRow)
  }

  async findAllPostable(): Promise<Tweet[]> {
    const rows = await this.db.any(sql<table.tweets>`
      SELECT *
        FROM tweets
       WHERE post_after IS NOT NULL
         AND post_after < CURRENT_TIMESTAMP
         AND status = 'draft'
    ORDER BY post_after ASC
    `)

    return rows.map(TweetRepository.fromRow)
  }

  async create(input: NewTweetInput): Promise<Tweet> {
    const postAfter = input.autopost
      ? sql.raw("CURRENT_TIMESTAMP + interval '5 minutes'")
      : null

    const row = await this.db.one(sql<table.tweets>`
      INSERT INTO tweets (
        feed_subscription_id,
        post_id,
        body,
        media_urls,
        position,
        post_after
      ) VALUES (
        ${input.feedSubscriptionId},
        ${input.postId},
        ${input.body},
        ${sql.array(input.mediaURLs, "text")},
        ${input.position},
        ${postAfter}
      )
      RETURNING *
    `)

    return TweetRepository.fromRow(row)
  }

  async update(id: TweetId, input: UpdateTweetInput): Promise<Tweet | null> {
    const assignments: NamedAssignmentType = {
      body: input.body,
      updated_at: sql.raw("CURRENT_TIMESTAMP"),
    }
    if (input.mediaURLs) {
      assignments.media_urls = sql.array(input.mediaURLs, "text")
    }

    const row = await this.db.maybeOne(sql<table.tweets>`
      UPDATE tweets
         SET ${sql.assignmentList(assignments)}
       WHERE id = ${id}
         AND status <> 'posted'
   RETURNING *
    `)

    return row && TweetRepository.fromRow(row)
  }

  async cancel(id: TweetId): Promise<Tweet | null> {
    const row = await this.db.maybeOne(sql<table.tweets>`
      UPDATE tweets
         SET status = 'canceled',
             updated_at = CURRENT_TIMESTAMP
       WHERE id = ${id}
         AND status <> 'posted'
   RETURNING *
    `)

    return row && TweetRepository.fromRow(row)
  }

  async uncancel(id: TweetId): Promise<Tweet | null> {
    const row = await this.db.maybeOne(sql<table.tweets>`
      UPDATE tweets
         SET status = 'draft',
             updated_at = CURRENT_TIMESTAMP
       WHERE id = ${id}
         AND status = 'canceled'
   RETURNING *
    `)

    return row && TweetRepository.fromRow(row)
  }

  async post(id: TweetId, postedTweetId: string): Promise<Tweet | null> {
    const row = await this.db.maybeOne(sql<table.tweets>`
      UPDATE tweets
         SET status = 'posted',
             post_after = NULL,
             posted_at = CURRENT_TIMESTAMP,
             posted_tweet_id = ${postedTweetId}
       WHERE id = ${id}
         AND status <> 'posted'
   RETURNING *
    `)

    return row && TweetRepository.fromRow(row)
  }

  static fromRow({
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
}

export default TweetRepository
