import db, { sql, NotFoundError } from "../db"
import {
  Feed,
  FeedId,
  FeedInput,
  PagingOptions,
  UserId,
  SubscribedFeed,
  FeedSubscriptionId,
} from "./types"
import { locateFeed } from "feed-locator"
import { scrapeFeed } from "scrape-feed"
import { importPosts } from "./post"
import { Pager } from "./pager"
import keyBy from "lodash/keyBy"

export async function allFeeds(
  options: PagingOptions = {}
): Promise<Pager<Feed, FeedRow>> {
  return new Pager({
    query: sql`SELECT * FROM feeds`,
    orderColumn: "url",
    totalQuery: sql`SELECT COUNT(*) FROM feeds`,
    variables: options,
    makeEdge(row) {
      return { node: fromRow(row), cursor: row.url }
    },
    getCursorValue: val => val,
  })
}

const feedSubscriptionsSelect = sql`
       feed_subscriptions.*,
       feeds.url,
       feeds.title,
       feeds.home_page_url,
       feeds.caching_headers,
       feeds.refreshed_at,
       feeds.created_at AS feed_created_at,
       feeds.updated_at AS feed_updated_at
  FROM feed_subscriptions
  JOIN feeds
    ON feed_subscriptions.feed_id = feeds.id
`

export function allFeedsForUser(
  userId: UserId,
  options: PagingOptions = {}
): Pager<SubscribedFeed, FeedSubscriptionRow> {
  return new Pager({
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
        node: fromSubscriptionRow(row),
        cursor: row.url,
      }
    },
    getCursorValue: val => val,
  })
}

export async function getFeed(id: FeedId): Promise<Feed> {
  try {
    const result = await db.one<FeedRow>(sql`
      SELECT * FROM feeds WHERE id = ${id}
    `)
    return fromRow(result)
  } catch (err) {
    if (err instanceof NotFoundError) {
      // @ts-ignore
      err.statusCode = 404
    }

    throw err
  }
}

export async function getFeedsById(ids: FeedId[]): Promise<(Feed | null)[]> {
  //  const query = sql<FeedRow>`
  //    SELECT * FROM feeds WHERE id = ANY(${sql.array(ids, "int")})
  //  `
  const rows = await db.any(sql<FeedRow>`
    SELECT * FROM feeds WHERE id IN (${sql.valueList(ids)})
  `)
  const byId = keyBy(rows.map(fromRow), "id")
  return ids.map(id => byId[id])
}

export async function getSubscribedFeed(
  id: FeedSubscriptionId
): Promise<SubscribedFeed> {
  try {
    const row = await db.one<FeedSubscriptionRow>(sql`
      SELECT ${feedSubscriptionsSelect}
      WHERE feed_subscriptions.id = ${id}
    `)
    return fromSubscriptionRow(row)
  } catch (err) {
    if (err instanceof NotFoundError) {
      // @ts-ignore
      err.statusCode = 404
    }

    throw err
  }
}

export async function getFeedSubscriptions(
  id: FeedId
): Promise<SubscribedFeed[]> {
  const rows = await db.any(sql<FeedSubscriptionRow>`
    SELECT ${feedSubscriptionsSelect}
     WHERE feeds.id = ${id}
  `)

  return rows.map(fromSubscriptionRow)
}

/**
 * Adds a feed to a user's list of subscribed feeds.
 *
 * @param input - A description of the feed to add
 * @returns The feed subscription
 */
export async function addFeed(input: FeedInput): Promise<SubscribedFeed> {
  const feedURL = await locateFeed(input.url)

  let feed = await getFeedByURL(feedURL)
  if (!feed) {
    feed = await createFeed(feedURL)
  }

  const id = await db.oneFirst<Pick<FeedSubscriptionRow, "id">>(sql`
    INSERT INTO feed_subscriptions (feed_id, user_id)
    VALUES (${feed.id}, ${input.userId})
    ON CONFLICT (feed_id, user_id)
    DO UPDATE SET discarded_at = NULL
    RETURNING id
  `)

  // we need the feed info, so we might as well just fetch out the whole dang thing
  return await getSubscribedFeed(id)
}

interface RefreshFeedOptions {
  force?: boolean
}

export async function refreshFeed(
  id: FeedId,
  options: RefreshFeedOptions = {}
): Promise<Feed> {
  const feed = await getFeed(id)

  const currentHeaders = options.force ? {} : feed.cachingHeaders || {}
  const feedContents = await scrapeFeed(feed.url, currentHeaders)
  if (!feedContents) {
    // feed is already up-to-date
    return feed
  }

  const { title, homePageURL, cachingHeaders } = feedContents
  const refreshedAt = await db.oneFirst<Pick<FeedRow, "refreshed_at">>(sql`
    UPDATE feeds
       SET title = ${title},
           home_page_url = ${homePageURL},
           caching_headers = ${JSON.stringify(cachingHeaders)},
           refreshed_at = CURRENT_TIMESTAMP
     WHERE id = ${id}
    RETURNING refreshed_at
  `)

  const { created, updated, unchanged } = await importPosts(
    id,
    feedContents.entries
  )
  console.log(
    `Imported posts. Created: ${created}. Updated: ${updated}. Unchanged: ${unchanged}`
  )

  return {
    ...feed,
    title,
    homePageURL,
    cachingHeaders,
    refreshedAt,
  }
}

/**
 * Removes a feed from a user's subscribed feeds.
 *
 * @remarks
 * Feed subscriptions are not removed, because it would break the connection
 * of which user a tweet belongs to. Instead, they are marked as discarded,
 * and can be restored if the user readds them later.
 *
 * @param id - The ID of the subscription to remove.
 */
export async function deleteFeed(id: FeedSubscriptionId): Promise<void> {
  await db.query(sql`
    UPDATE feed_subscriptions
       SET discarded_at = CURRENT_TIMESTAMP
     WHERE id = ${id}
  `)
}

async function getFeedByURL(url: string): Promise<Feed | null> {
  const row = await db.maybeOne<FeedRow>(sql`
    SELECT * FROM feeds WHERE url = ${url}
  `)

  return row && fromRow(row)
}

async function createFeed(url: string): Promise<Feed> {
  const id = await db.oneFirst<Pick<FeedRow, "id">>(sql`
    INSERT INTO feeds (url)
    VALUES (${url})
    RETURNING id
  `)

  return await refreshFeed(id)
}

interface FeedRow {
  id: string
  url: string
  title: string
  home_page_url: string
  caching_headers: any
  refreshed_at: Date | null
  created_at: Date
  updated_at: Date
}

function fromRow({
  id,
  url,
  title,
  home_page_url,
  caching_headers,
  refreshed_at,
  created_at,
  updated_at,
}: FeedRow): Feed {
  return {
    id,
    url,
    title,
    homePageURL: home_page_url,
    cachingHeaders: caching_headers,
    refreshedAt: refreshed_at,
    createdAt: created_at,
    updatedAt: updated_at,
  }
}

interface FeedSubscriptionRow {
  id: string
  feed_id: string
  autopost: boolean
  created_at: Date
  updated_at: Date

  // pulled in from the feed to use as a cursor
  url: string
}

function fromSubscriptionRow({
  id,
  feed_id,
  autopost,
  created_at,
  updated_at,
}: FeedSubscriptionRow): SubscribedFeed {
  return {
    id,
    feedId: feed_id,
    autopost,
    createdAt: created_at,
    updatedAt: updated_at,
  }
}
