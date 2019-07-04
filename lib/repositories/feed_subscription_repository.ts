import { sql, DatabasePoolType, NamedAssignmentType } from "../db"
import * as table from "../data/dbTypes"
import {
  PagingOptions,
  SubscribedFeed,
  UserId,
  FeedSubscriptionId,
  FeedId,
} from "../data/types"
import { Pager } from "../data/pager"
import { injectable, inject } from "inversify"
import Loader, { LoaderQueryFn } from "../data/loader"
import { UserIdProvider } from "../services/user_service"

type FeedSubscriptionRow = table.feed_subscriptions & Pick<table.feeds, "url">
type NullPartial<T> = { [P in keyof T]?: T[P] | null }

@injectable()
class FeedSubscriptionRepository {
  constructor(@inject("db") private db: DatabasePoolType) {}

  paged(
    userId: UserId,
    options: PagingOptions = {}
  ): Pager<SubscribedFeed, FeedSubscriptionRow> {
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
      orderColumn: "url",
      totalQuery: sql`
        SELECT COUNT(*) FROM feed_subscriptions WHERE user_id = ${userId}`,
      variables: options,
      makeEdge(row) {
        return {
          node: FeedSubscriptionRepository.fromRow(row),
          cursor: row.url,
        }
      },
      getCursorValue: val => val,
    })
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
    const options: NamedAssignmentType = {}
    if (autopost !== undefined && autopost !== null) {
      options.autopost = autopost
    }

    if (Object.keys(options).length === 0) {
      throw new Error("no options provided to change")
    }

    const row = await this.db.one(sql<table.feed_subscriptions>`
      UPDATE feed_subscriptions
         SET ${sql.assignmentList(options)},
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
}

export default FeedSubscriptionRepository

@injectable()
export class SubscribedFeedLoader extends Loader<
  SubscribedFeed,
  table.feed_subscriptions
> {
  constructor(
    @inject("db") db: DatabasePoolType,
    @inject("userId") private getUserId: UserIdProvider
  ) {
    super(db)
  }

  query: LoaderQueryFn<table.feed_subscriptions> = async cond => {
    const userId = await this.getUserId()
    if (userId) {
      return sql`
        SELECT *
          FROM feed_subscriptions
         WHERE user_id = ${userId}
           AND ${cond("feed_subscriptions")}
      `
    } else {
      return sql`
        SELECT *
          FROM feed_subscriptions
         WHERE ${cond("feed_subscriptions")}
      `
    }
  }
  fromRow = FeedSubscriptionRepository.fromRow
}
