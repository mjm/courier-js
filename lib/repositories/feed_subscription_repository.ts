import { inject,injectable } from "inversify"

import * as table from "../data/dbTypes"
import { LoaderQueryFn, QueryLoader } from "../data/loader"
import { Pager, PagerEdge } from "../data/pager"
import {
  FeedId,
  FeedSubscriptionId,
  PagingOptions,
  SubscribedFeed,
  UserId,
} from "../data/types"
import { DatabasePoolType,sql } from "../db"
import * as keys from "../key"

type FeedSubscriptionRow = table.feed_subscriptions & Pick<table.feeds, "url">
type NullPartial<T> = { [P in keyof T]?: T[P] | null }

export type FeedSubscriptionPager = Pager<SubscribedFeed, FeedSubscriptionRow>

@injectable()
class FeedSubscriptionRepository {
  constructor(@inject(keys.DB) private db: DatabasePoolType) {}

  paged(userId: UserId, options: PagingOptions = {}): FeedSubscriptionPager {
    return new Pager({
      db: this.db,
      query: sql`
        SELECT feed_subscriptions.*,
               feeds.url
          FROM feed_subscriptions
          JOIN feeds
            ON feed_subscriptions.feed_id = feeds.id
         WHERE user_id = ${userId}
           AND discarded_at IS NULL`,
      orderBy: { column: "url", direction: "ASC" },
      totalQuery: sql`
        SELECT COUNT(*) FROM feed_subscriptions WHERE user_id = ${userId} AND discarded_at IS NULL`,
      variables: options,
      makeEdge: FeedSubscriptionRepository.makeEdge,
      getCursorValue: val => val,
    })
  }

  async getEdge(id: FeedSubscriptionId): Promise<PagerEdge<SubscribedFeed>> {
    const row = await this.db.one(sql<FeedSubscriptionRow>`
      SELECT feed_subscriptions.*,
             feeds.url
        FROM feed_subscriptions
        JOIN feeds
          ON feed_subscriptions.feed_id = feeds.id
       WHERE feed_subscriptions.id = ${id}
         AND discarded_at IS NULL
    `)

    return FeedSubscriptionRepository.makeEdge(row)
  }

  async findAllByFeed(id: FeedId): Promise<SubscribedFeed[]> {
    const rows = await this.db.any(sql<table.feed_subscriptions>`
      SELECT *
        FROM feed_subscriptions
       WHERE feed_id = ${id}
    `)

    return rows.map(FeedSubscriptionRepository.fromRow)
  }

  async create(userId: UserId, feedId: FeedId): Promise<SubscribedFeed> {
    const row = await this.db.one(sql<table.feed_subscriptions>`
      INSERT INTO feed_subscriptions (feed_id, user_id)
      VALUES (${feedId}, ${userId})
      ON CONFLICT (feed_id, user_id)
      DO UPDATE SET discarded_at = NULL
      RETURNING *
    `)

    return FeedSubscriptionRepository.fromRow(row)
  }

  async update(
    userId: UserId,
    id: FeedSubscriptionId,
    { autopost }: NullPartial<Pick<table.feed_subscriptions, "autopost">>
  ): Promise<SubscribedFeed> {
    const updates = []
    if (autopost !== undefined && autopost !== null) {
      updates.push(sql`autopost = ${autopost}`)
    }

    if (updates.length === 0) {
      throw new Error("no options provided to change")
    }

    const row = await this.db.one(sql<table.feed_subscriptions>`
      UPDATE feed_subscriptions
         SET ${sql.join(updates, sql`, `)},
             updated_at = CURRENT_TIMESTAMP
       WHERE id = ${id}
         AND user_id = ${userId}
   RETURNING *
    `)

    return FeedSubscriptionRepository.fromRow(row)
  }

  async delete(userId: UserId, id: FeedSubscriptionId): Promise<void> {
    await this.db.query(sql`
      UPDATE feed_subscriptions
         SET discarded_at = CURRENT_TIMESTAMP
       WHERE id = ${id}
         AND user_id = ${userId}
    `)
  }

  static fromRow({
    id,
    feed_id,
    user_id,
    autopost,
    created_at,
    updated_at,
  }: table.feed_subscriptions): SubscribedFeed {
    return {
      id: id.toString(),
      feedId: feed_id.toString(),
      userId: user_id.toString(),
      autopost,
      createdAt: created_at,
      updatedAt: updated_at,
    }
  }

  static makeEdge(row: FeedSubscriptionRow): PagerEdge<SubscribedFeed> {
    return {
      node: FeedSubscriptionRepository.fromRow(row),
      cursor: row.url,
    }
  }
}

export default FeedSubscriptionRepository

@injectable()
export class SubscribedFeedLoader extends QueryLoader<
  SubscribedFeed,
  table.feed_subscriptions
> {
  constructor(
    @inject(keys.DB) db: DatabasePoolType,
    @inject(keys.UserId) private getUserId: () => Promise<UserId>
  ) {
    super(db)
  }

  query: LoaderQueryFn<table.feed_subscriptions> = async cond => {
    try {
      const userId = await this.getUserId()
      return sql`
        SELECT *
          FROM feed_subscriptions
         WHERE user_id = ${userId}
           AND ${cond("feed_subscriptions")}
      `
    } catch (_e) {
      return sql`
        SELECT *
          FROM feed_subscriptions
         WHERE ${cond("feed_subscriptions")}
      `
    }
  }
  fromRow = FeedSubscriptionRepository.fromRow
}
