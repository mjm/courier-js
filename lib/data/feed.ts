import db from "../db"
import { Feed, FeedInput } from "./types"
import { locateFeed } from "feed-locator"
import { scrapeFeed } from "scrape-feed"

export async function allFeeds(): Promise<Feed[]> {
  const { rows } = await db.query(
    `SELECT id, url, title, home_page_url FROM feeds`
  )

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
    `INSERT INTO feeds(url, title, home_page_url)
     VALUES($1, '', '')
     RETURNING id`,
    [feedURL]
  )

  return {
    url: feedURL,
    title: "",
    homePageURL: "",
    id: rows[0].id,
  }
}

export async function refreshFeed(id: string): Promise<Feed> {
  const feed = await getFeed(id)

  // TODO reuse caching headers
  const feedContents = await scrapeFeed(feed.url)
  if (!feedContents) {
    return feed
  }

  const { title, homePageURL } = feedContents
  await db.query(
    `UPDATE feeds
     SET title = $2, home_page_url = $3
     WHERE id = $1`,
    [id, title, homePageURL]
  )

  return { ...feed, title, homePageURL }
}

interface FeedRow {
  id: string
  url: string
  title: string
  home_page_url: string
}

function fromRow({ id, url, title, home_page_url }: FeedRow): Feed {
  return {
    id,
    url,
    title,
    homePageURL: home_page_url,
  }
}
