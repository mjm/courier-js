import db, { sql, NotFoundError } from "../db"
import {
  Feed,
  FeedId,
  FeedInput,
  PagingOptions,
  UserId,
  SubscribedFeed,
  FeedSubscriptionId,
  UpdateFeedOptionsInput,
} from "./types"
import { locateFeed } from "feed-locator"
import { scrapeFeed, normalizeURL } from "scrape-feed"
import { importPosts, getRecentPosts } from "./post"
import { Pager } from "./pager"
import { importTweets } from "./tweet"
import { getByIds } from "./util"
import * as table from "./dbTypes"
import { NamedAssignmentType } from "slonik"

type FeedSubscriptionRow = table.feed_subscriptions & Pick<table.feeds, "url">

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
    const result = await db.one<table.feeds>(sql`
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
  return await getByIds({
    query: cond => sql`SELECT * FROM feeds WHERE ${cond}`,
    ids,
    fromRow,
  })
}

export async function getFeedsByHomePageURL(url: string): Promise<Feed[]> {
  const homePageURL = normalizeURL(url)
  const rows = await db.any(sql<table.feeds>`
    SELECT * FROM feeds WHERE home_page_url = ${homePageURL}
  `)
  return rows.map(fromRow)
}

export async function getSubscriptionsById(
  userId: UserId,
  ids: FeedSubscriptionId[]
): Promise<(SubscribedFeed | null)[]> {
  return await getByIds({
    query: cond => sql`
      SELECT * FROM feed_subscriptions
       WHERE user_id = ${userId}
         AND ${cond}
    `,
    ids,
    fromRow: fromSubscriptionRow,
  })
}

export async function getFeedSubscriptions(
  id: FeedId
): Promise<SubscribedFeed[]> {
  const rows = await db.any(sql<FeedSubscriptionRow>`
    SELECT *
      FROM feed_subscriptions
     WHERE feed_id = ${id}
  `)

  return rows.map(fromSubscriptionRow)
}

export async function getFeedSubscription(
  id: FeedSubscriptionId
): Promise<SubscribedFeed> {
  const row = await db.one(sql<FeedSubscriptionRow>`
    SELECT *
      FROM feed_subscriptions
     WHERE id = ${id}
  `)

  return fromSubscriptionRow(row)
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

  const row = await db.one<FeedSubscriptionRow>(sql`
    INSERT INTO feed_subscriptions (feed_id, user_id)
    VALUES (${feed.id}, ${input.userId})
    ON CONFLICT (feed_id, user_id)
    DO UPDATE SET discarded_at = NULL
    RETURNING *
  `)

  const subscribedFeed = fromSubscriptionRow(row)

  await importRecentPosts(subscribedFeed)

  return subscribedFeed
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
  const refreshedAt = await db.oneFirst<Pick<table.feeds, "refreshed_at">>(sql`
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

export async function updateFeedOptions(
  userId: UserId,
  input: UpdateFeedOptionsInput
): Promise<SubscribedFeed> {
  const options: NamedAssignmentType = {}
  if (input.autopost !== undefined && input.autopost !== null) {
    options.autopost = input.autopost
  }

  if (Object.keys(options).length === 0) {
    throw new Error("no options provided to change")
  }

  const row = await db.one(sql<FeedSubscriptionRow>`
    UPDATE feed_subscriptions
       SET ${sql.assignmentList(options)},
           updated_at = CURRENT_TIMESTAMP
     WHERE id = ${input.id}
       AND user_id = ${userId}
 RETURNING *
  `)

  return fromSubscriptionRow(row)
}

/**
 * Removes a feed from a user's subscribed feeds.
 *
 * @remarks
 * Feed subscriptions are not removed, because it would break the connection
 * of which user a tweet belongs to. Instead, they are marked as discarded,
 * and can be restored if the user readds them later.
 *
 * @param userId - The ID of the user who is removing the subscription.
 *   This must match the user ID on the subscription or this will do nothing.
 * @param id - The ID of the subscription to remove.
 */
export async function deleteFeed(
  userId: UserId,
  id: FeedSubscriptionId
): Promise<void> {
  await db.query(sql`
    UPDATE feed_subscriptions
       SET discarded_at = CURRENT_TIMESTAMP
     WHERE id = ${id}
       AND user_id = ${userId}
  `)
}

async function getFeedByURL(url: string): Promise<Feed | null> {
  const row = await db.maybeOne<table.feeds>(sql`
    SELECT * FROM feeds WHERE url = ${url}
  `)

  return row && fromRow(row)
}

async function createFeed(url: string): Promise<Feed> {
  const id = await db.oneFirst<Pick<table.feeds, "id">>(sql`
    INSERT INTO feeds (url)
    VALUES (${url})
    RETURNING id
  `)

  return await refreshFeed(id.toString())
}

async function importRecentPosts(feed: SubscribedFeed): Promise<void> {
  // translating every post for the new subscription could be an excessive amount of work
  const posts = await getRecentPosts(feed.feedId)

  await Promise.all(
    posts.map(async post => {
      await importTweets({
        feedSubscriptionId: feed.id,
        post,
      })
    })
  )
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
}: table.feeds): Feed {
  return {
    id: id.toString(),
    url,
    title,
    homePageURL: home_page_url,
    cachingHeaders: caching_headers,
    refreshedAt: refreshed_at,
    createdAt: created_at,
    updatedAt: updated_at,
  }
}

function fromSubscriptionRow({
  id,
  feed_id,
  autopost,
  created_at,
  updated_at,
}: FeedSubscriptionRow): SubscribedFeed {
  return {
    id: id.toString(),
    feedId: feed_id.toString(),
    autopost,
    createdAt: created_at,
    updatedAt: updated_at,
  }
}
