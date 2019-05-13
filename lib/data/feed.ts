import db from "../db"
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

export async function allFeeds(
  options: PagingOptions = {}
): Promise<Pager<Feed, string>> {
  return new Pager({
    query: "SELECT * FROM feeds",
    orderColumn: "url",
    totalQuery: "SELECT COUNT(*) FROM feeds",
    variables: options,
    makeEdge(row) {
      return { node: fromRow(row), cursor: row.url }
    },
    getCursorValue: val => val,
  })
}

export function allFeedsForUser(
  userId: UserId,
  options: PagingOptions = {}
): Pager<SubscribedFeed, string> {
  return new Pager({
    query: `
      SELECT feed_subscriptions.*,
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
       WHERE feed_subscriptions.user_id = $1
         AND feed_subscriptions.discarded_at IS NULL`,
    args: [userId],
    orderColumn: "url",
    totalQuery: `SELECT COUNT(*) FROM feed_subscriptions WHERE user_id = $1`,
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
  const { rows } = await db.query(`SELECT * FROM feeds WHERE id = $1 LIMIT 1`, [
    id,
  ])

  if (rows.length) {
    return fromRow(rows[0])
  } else {
    const err = new Error(`No feed found with ID ${id}`)
    // @ts-ignore
    err.statusCode = 404
    throw err
  }
}

export async function getSubscribedFeed(
  id: FeedSubscriptionId
): Promise<SubscribedFeed> {
  const { rows } = await db.query(
    `SELECT feed_subscriptions.*,
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
      WHERE feed_subscriptions.id = $1`,
    [id]
  )

  if (rows.length) {
    return fromSubscriptionRow(rows[0])
  } else {
    const err = new Error(`No feed subscription found with ID ${id}`)
    // @ts-ignore
    err.statusCode = 404
    throw err
  }
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

  const { rows } = await db.query(
    `INSERT INTO feed_subscriptions (feed_id, user_id)
     VALUES ($1, $2)
     ON CONFLICT (feed_id, user_id)
     DO UPDATE SET discarded_at = NULL
     RETURNING id`,
    [feed.id, input.userId]
  )

  // we need the feed info, so we might as well just fetch out the whole dang thing
  return await getSubscribedFeed(rows[0].id)
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
  const { rows } = await db.query(
    `UPDATE feeds
     SET title = $2,
         home_page_url = $3,
         caching_headers = $4,
         refreshed_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING refreshed_at`,
    [id, title, homePageURL, cachingHeaders]
  )

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
    refreshedAt: rows[0].refreshed_at,
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
  await db.query(
    `UPDATE feed_subscriptions
        SET discarded_at = CURRENT_TIMESTAMP
      WHERE id = $1`,
    [id]
  )
}

async function getFeedByURL(url: string): Promise<Feed | null> {
  const { rows } = await db.query(
    `SELECT * FROM feeds WHERE url = $1 LIMIT 1`,
    [url]
  )

  if (rows.length) {
    return fromRow(rows[0])
  } else {
    return null
  }
}

async function createFeed(url: string): Promise<Feed> {
  const { rows } = await db.query(
    `INSERT INTO feeds(url)
     VALUES($1)
     RETURNING id`,
    [url]
  )

  const id = rows[0].id
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

interface FeedSubscriptionRow extends FeedRow {
  feed_id: string
  autopost: boolean
  feed_created_at: Date
  feed_updated_at: Date
}

function fromSubscriptionRow({
  id,
  feed_id,
  autopost,
  created_at,
  updated_at,
  feed_created_at,
  feed_updated_at,
  ...rest
}: FeedSubscriptionRow): SubscribedFeed {
  return {
    id,
    autopost,
    createdAt: created_at,
    updatedAt: updated_at,
    feed: fromRow({
      id: feed_id,
      created_at: feed_created_at,
      updated_at: feed_updated_at,
      ...rest,
    }),
  }
}
