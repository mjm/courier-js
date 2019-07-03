import { sql, DatabasePoolType } from "../db"
import { FeedId, Feed } from "../data/types"
import * as table from "../data/dbTypes"
import { getByIds } from "../data/util"
import { normalizeURL } from "scrape-feed"
import DataLoader from "dataloader"

export type FeedLoader = DataLoader<FeedId, Feed | null>

class FeedRepository {
  constructor(private db: DatabasePoolType) {}

  createLoader(): FeedLoader {
    return new DataLoader(async ids => {
      return await getByIds({
        db: this.db,
        query: cond => sql`SELECT * FROM feeds WHERE ${cond}`,
        ids,
        fromRow: FeedRepository.fromRow,
      })
    })
  }

  async findAllByHomePageURL(url: string): Promise<Feed[]> {
    const homePageURL = normalizeURL(url)

    const rows = await this.db.any(sql<table.feeds>`
      SELECT * FROM feeds WHERE home_page_url = ${homePageURL}
    `)

    return rows.map(FeedRepository.fromRow)
  }

  async findByURL(url: string): Promise<Feed | null> {
    const row = await this.db.maybeOne(sql<table.feeds>`
      SELECT * FROM feeds WHERE url = ${url}
    `)

    return row && FeedRepository.fromRow(row)
  }

  async create(url: string): Promise<Feed> {
    const row = await this.db.one(sql<table.feeds>`
      INSERT INTO feeds (url)
      VALUES (${url})
      RETURNING *
    `)

    return FeedRepository.fromRow(row)
  }

  async update(
    id: FeedId,
    {
      title,
      homePageURL,
      cachingHeaders,
    }: Pick<Feed, "title" | "homePageURL" | "cachingHeaders">
  ): Promise<Feed> {
    const row = await this.db.one(sql<table.feeds>`
      UPDATE feeds
         SET title = ${title},
             home_page_url = ${homePageURL},
             caching_headers = ${JSON.stringify(cachingHeaders)},
             refreshed_at = CURRENT_TIMESTAMP,
             updated_at = CURRENT_TIMESTAMP
       WHERE id = ${id}
   RETURNING *
    `)

    return FeedRepository.fromRow(row)
  }

  static fromRow({
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
}

export default FeedRepository
