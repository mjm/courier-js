import db from "../db"
import { Feed, FeedInput } from "./types"
import { locateFeed } from "feed-locator"
import { scrapeFeed } from "scrape-feed"

export async function allFeeds(): Promise<Feed[]> {
  const { rows } = await db.query(`SELECT * FROM feeds`)

  return rows.map(fromRow)
}

export async function getFeed(id: string): Promise<Feed> {
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

export async function addFeed(input: FeedInput): Promise<Feed> {
  const feedURL = await locateFeed(input.url)

  const { rows } = await db.query(
    `INSERT INTO feeds(url)
     VALUES($1)
     RETURNING id`,
    [feedURL]
  )

  const id = rows[0].id
  return await refreshFeed(id)
}

export async function refreshFeed(id: string): Promise<Feed> {
  const feed = await getFeed(id)

  const currentHeaders = feed.cachingHeaders || {}
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

  return {
    ...feed,
    title,
    homePageURL,
    cachingHeaders,
    refreshedAt: rows[0].refreshed_at,
  }
}

// TODO this should only delete a subscription eventually
export async function deleteFeed(id: string): Promise<void> {
  await db.query(`DELETE FROM feeds WHERE id = $1`, [id])
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
