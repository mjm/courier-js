import { inject, injectable } from "inversify"
import groupBy from "lodash/groupBy"
import moment from "moment"
import { DatabasePoolType, sql, ValueExpressionType } from "slonik"

import * as table from "lib/data/dbTypes"
import { LoaderQueryFn, QueryLoader } from "lib/data/loader"
import { Pager } from "lib/data/pager"
import {
  BulkNewTweetInput,
  FeedSubscriptionId,
  NewTweetInput,
  PagingOptions,
  PostId,
  Tweet,
  TweetId,
  UpdateTweetInput,
  UserId,
} from "lib/data/types"
import * as keys from "lib/key"

type TweetRow = table.tweets & Pick<table.posts, "published_at">
export type TweetPagingOptions = PagingOptions & {
  filter?: "UPCOMING" | "PAST" | null
}

export type TweetPager = Pager<Tweet, TweetRow>

@injectable()
class TweetRepository {
  constructor(@inject(keys.DB) private db: DatabasePoolType) {}

  paged(
    userId: UserId,
    { filter, ...variables }: TweetPagingOptions = {}
  ): TweetPager {
    let filterCondition: ValueExpressionType = sql``
    if (filter) {
      const operator = filter === "UPCOMING" ? sql`=` : sql`<>`
      filterCondition = sql`AND ${sql.identifier([
        "tweets",
        "status",
      ])} ${operator} ${"draft"}`
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
      orderBy: { column: "published_at", direction: "DESC" },
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

  /**
   * Find all of the tweets in a feed subscription for each of a given list of post IDs.
   *
   * @param feedSubscriptionId The ID of the feed subscription the tweets belong to.
   * @param postIds The IDs of the posts whose tweets should be found.
   * @returns A list of lists of tweets. Each list of tweets corresponds to the post
   * at the same index in `postIds`.
   */
  async findAllByPosts(
    feedSubscriptionId: FeedSubscriptionId,
    postIds: PostId[]
  ): Promise<Tweet[][]> {
    const rows = await this.db.any<table.tweets>(sql`
      SELECT *
        FROM tweets
       WHERE feed_subscription_id = ${feedSubscriptionId}
         AND post_id = ANY(${sql.array(postIds, "int4")})
    ORDER BY post_id, position
    `)
    const byId = groupBy(rows.map(TweetRepository.fromRow), x => x.postId)
    return postIds.map(id => byId[id] || [])
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
      ? sql`CURRENT_TIMESTAMP + interval '5 minutes'`
      : null

    let row: table.tweets
    if (input.action === "tweet") {
      row = await this.db.one(sql<table.tweets>`
        INSERT INTO tweets (
          feed_subscription_id,
          post_id,
          action,
          body,
          media_urls,
          position,
          post_after
        ) VALUES (
          ${input.feedSubscriptionId},
          ${input.postId},
          'tweet',
          ${input.body},
          ${sql.array(input.mediaURLs, "text")},
          ${input.position},
          ${postAfter}
        )
        RETURNING *
      `)
    } else if (input.action === "retweet") {
      row = await this.db.one(sql<table.tweets>`
        INSERT INTO tweets (
          feed_subscription_id,
          post_id,
          action,
          retweet_id,
          position,
          post_after
        ) VALUES (
          ${input.feedSubscriptionId},
          ${input.postId},
          'retweet'
          ${input.retweetID},
          ${input.position},
          ${postAfter}
        )
        RETURNING *
      `)
    } else {
      throw new Error(`Unrecognized tweet action type`)
    }

    return TweetRepository.fromRow(row)
  }

  /**
   * Create many new tweets with one query.
   *
   * This supports creating tweets across many different posts, which is useful for
   * reducing the number of queries involved when importing a new feed.
   *
   * @param feedSubscriptionId The ID of the feed subscription that the tweets belong to.
   * @param autopost Whether the new tweets should be autoposted.
   * @param inputs The list of new tweet data to create.
   *
   * @returns The list of created tweets.
   */
  async bulkCreate(
    feedSubscriptionId: FeedSubscriptionId,
    autopost: boolean,
    inputs: BulkNewTweetInput[]
  ): Promise<Tweet[]> {
    if (!inputs.length) {
      return []
    }

    const postAfter = autopost
      ? sql`CURRENT TIMESTAMP + interval '5 minutes'`
      : null

    const rows = await this.db.any<table.tweets>(sql`
      INSERT INTO tweets (
        feed_subscription_id,
        post_after,
        post_id,
        action,
        body,
        media_urls,
        retweet_id,
        position
      )
      SELECT ${feedSubscriptionId},
             ${postAfter},
             v.post_id,
             v.action,
             v.body,
             ARRAY(SELECT json_array_elements_text(v.media_urls)),
             v.retweet_id,
             v.position
        FROM ${sql.unnest(
          inputs.map(i => [
            i.postId,
            i.action,
            i.body ?? "",
            JSON.stringify(i.mediaURLs ?? []),
            i.retweetID ?? "",
            i.position,
          ]),
          ["int8", "tweet_action", "text", "json", "text", "int4"]
        )} v(post_id, action, body, media_urls, retweet_id, position)
      RETURNING *
    `)

    return rows.map(TweetRepository.fromRow)
  }

  async update(id: TweetId, input: UpdateTweetInput): Promise<Tweet | null> {
    const assignments = [
      sql`body = ${input.body}`,
      sql`updated_at = CURRENT_TIMESTAMP`,
    ]
    if (input.action) {
      assignments.push(sql`action = ${input.action}`)
    }
    if (input.mediaURLs) {
      assignments.push(sql`media_urls = ${sql.array(input.mediaURLs, "text")}`)
    }
    if (input.retweetID !== undefined && input.retweetID !== null) {
      assignments.push(sql`retweet_id = ${input.retweetID}`)
    }

    const row = await this.db.maybeOne(sql<table.tweets>`
      UPDATE tweets
         SET ${sql.join(assignments, sql`, `)}
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

  async dequeue(id: TweetId): Promise<void> {
    await this.db.query(sql`
      UPDATE tweets
         SET post_after = NULL
       WHERE id = ${id}
    `)
  }

  static fromRow({
    id,
    post_id,
    feed_subscription_id,
    action,
    body,
    media_urls,
    retweet_id,
    status,
    post_after,
    posted_at,
    posted_tweet_id,
  }: table.tweets): Tweet {
    return {
      id: id.toString(),
      feedSubscriptionId: feed_subscription_id.toString(),
      postId: post_id.toString(),
      action,
      body,
      mediaURLs: media_urls,
      retweetID: retweet_id,
      status,
      postAfter: post_after,
      postedAt: posted_at,
      postedTweetID: posted_tweet_id,
    }
  }
}

export default TweetRepository

@injectable()
export class TweetLoader extends QueryLoader<Tweet, table.tweets> {
  constructor(
    @inject(keys.DB) db: DatabasePoolType,
    @inject(keys.UserId) private getUserId: () => Promise<UserId>
  ) {
    super(db)
  }

  query: LoaderQueryFn<table.tweets> = async cond => {
    try {
      const userId = await this.getUserId()
      return sql`
        SELECT tweets.*
          FROM tweets
          JOIN feed_subscriptions
            ON tweets.feed_subscription_id = feed_subscriptions.id
         WHERE feed_subscriptions.user_id = ${userId}
           AND ${cond("tweets")}
      `
    } catch (_e) {
      return sql`
        SELECT *
          FROM tweets
         WHERE ${cond("tweets")}
      `
    }
  }
  fromRow = TweetRepository.fromRow
}
