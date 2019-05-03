import db from "../db"
import { Feed, FeedInput } from "./types"

export async function allFeeds(): Promise<Feed[]> {
  const { rows } = await db.query(
    `SELECT id, url, title, home_page_url FROM feeds`
  )

  return rows.map(fromRow)
}

export async function createFeed(input: FeedInput): Promise<Feed> {
  const { rows } = await db.query(
    `INSERT INTO feeds(url, title, home_page_url)
     VALUES($1, $2, $3)
     RETURNING id`,
    [input.url, input.title, input.homePageURL]
  )

  return { ...input, id: rows[0].id }
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
