import { sql, DatabasePoolType } from "../db"
import * as table from "../data/dbTypes"
import { FeedId, Feed } from "../data/types"
import { injectable, inject } from "inversify"
import { LoaderQueryFn, QueryLoader } from "../data/loader"
import { DB } from "../key"

@injectable()
class FeedRepository {
  constructor(@inject(DB) private db: DatabasePoolType) {}

  async findAllByHomePageURL(url: string): Promise<Feed[]> {
    const rows = await this.db.any(sql<table.feeds>`
      SELECT * FROM feeds WHERE home_page_url = ${url}
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

@injectable()
export class FeedLoader extends QueryLoader<Feed, table.feeds> {
  constructor(@inject(DB) db: DatabasePoolType) {
    super(db)
  }

  query: LoaderQueryFn<table.feeds> = async cond =>
    sql`SELECT * FROM feeds WHERE ${cond("feeds")}`
  fromRow = FeedRepository.fromRow
}

export default FeedRepository
