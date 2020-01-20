import { inject, injectable } from "inversify"
import keyBy from "lodash/keyBy"
import moment from "moment"

import * as table from "lib/data/dbTypes"
import { LoaderQueryFn, QueryLoader } from "lib/data/loader"
import { Pager } from "lib/data/pager"
import {
  FeedId,
  NewPostInput,
  PagingOptions,
  Post,
  PostId,
  UpdatePostInput,
} from "lib/data/types"
import { DatabasePoolType, sql } from "lib/db"
import { DB } from "lib/key"

@injectable()
class PostRepository {
  constructor(@inject(DB) private db: DatabasePoolType) {}

  pagedByFeed(
    feedId: FeedId,
    options: PagingOptions = {}
  ): Pager<Post, table.posts> {
    return new Pager({
      db: this.db,
      query: sql`SELECT * FROM posts WHERE feed_id = ${feedId}`,
      orderBy: { column: "published_at", direction: "DESC" },
      totalQuery: sql`SELECT COUNT(*) FROM posts WHERE feed_id = ${feedId}`,
      variables: options,
      makeEdge(row) {
        return {
          node: PostRepository.fromRow(row),
          // TODO oh no what if the published_at is NULL
          cursor: row.published_at ? moment.utc(row.published_at).format() : "",
        }
      },
      getCursorValue(cursor) {
        return cursor || null
      },
    })
  }

  async findByItemID(feedId: FeedId, itemId: string): Promise<Post | null> {
    const row = await this.db.maybeOne(sql<table.posts>`
      SELECT *
        FROM posts
       WHERE feed_id = ${feedId}
         AND item_id = ${itemId}
    `)

    return row && PostRepository.fromRow(row)
  }

  async findByItemIDs(
    feedId: FeedId,
    itemIds: string[]
  ): Promise<(Post | null)[]> {
    const rows = await this.db.any(sql<table.posts>`
      SELECT *
        FROM posts
       WHERE feed_id = ${feedId}
         AND item_id = ANY(${sql.array(itemIds, "text")})
    `)
    const byId = keyBy(rows.map(PostRepository.fromRow), x => x.itemId)
    return itemIds.map(id => byId[id] || null)
  }

  async create(input: NewPostInput): Promise<Post> {
    const row = await this.db.one(sql<table.posts>`
      INSERT INTO posts(
        feed_id,
        item_id,
        url,
        title,
        text_content,
        html_content,
        published_at,
        modified_at
      ) VALUES (
        ${input.feedId},
        ${input.itemId},
        ${input.url},
        ${input.title},
        ${input.textContent},
        ${input.htmlContent},
        ${input.publishedAt && input.publishedAt.toISOString()},
        ${input.modifiedAt && input.modifiedAt.toISOString()}
      )
      RETURNING *
    `)

    return PostRepository.fromRow(row)
  }

  async bulkCreate(inputs: NewPostInput[]): Promise<Post[]> {
    if (!inputs.length) {
      return []
    }

    const rows = await this.db.any<table.posts>(sql`
      INSERT INTO posts (
        feed_id,
        item_id,
        url,
        title,
        text_content,
        html_content,
        published_at,
        modified_at
      )
      SELECT * FROM ${sql.unnest(
        inputs.map(i => [
          i.feedId,
          i.itemId,
          i.url,
          i.title,
          i.textContent,
          i.htmlContent,
          i.publishedAt?.toISOString() ?? null,
          i.modifiedAt?.toISOString() ?? null,
        ]),
        [
          "int4",
          "text",
          "text",
          "text",
          "text",
          "text",
          "timestamp",
          "timestamp",
        ]
      )}
      RETURNING *
    `)

    return rows.map(PostRepository.fromRow)
  }

  async update(id: PostId, input: UpdatePostInput): Promise<Post> {
    const row = await this.db.one(sql<table.posts>`
      UPDATE posts
         SET url = ${input.url},
             title = ${input.title},
             text_content = ${input.textContent},
             html_content = ${input.htmlContent},
             published_at = ${input.publishedAt &&
               input.publishedAt.toISOString()},
             modified_at = ${input.modifiedAt &&
               input.modifiedAt.toISOString()},
             updated_at = CURRENT_TIMESTAMP
       WHERE id = ${id}
   RETURNING *
    `)

    return PostRepository.fromRow(row)
  }

  async bulkUpdate(
    inputs: ({ id: PostId } & UpdatePostInput)[]
  ): Promise<Post[]> {
    if (!inputs.length) {
      return []
    }

    const rows = await this.db.any<table.posts>(sql`
      UPDATE posts
         SET url = v.url,
             title = v.title,
             text_content = v.text_content,
             html_content = v.html_content,
             published_at = v.published_at,
             modified_at = v.modified_at,
             updated_at = CURRENT_TIMESTAMP
        FROM (
          SELECT * FROM ${sql.unnest(
            inputs.map(i => [
              i.id,
              i.url,
              i.title,
              i.textContent,
              i.htmlContent,
              i.publishedAt?.toISOString() ?? null,
              i.modifiedAt?.toISOString() ?? null,
            ]),
            ["int4", "text", "text", "text", "text", "timestamp", "timestamp"]
          )}
        )
        v(id, url, title, text_content, html_content, published_at, modified_at)
       WHERE posts.id = v.id
       RETURNING *
    `)

    return rows.map(PostRepository.fromRow)
  }

  static fromRow(row: table.posts): Post {
    return {
      id: row.id.toString(),
      feedId: row.feed_id.toString(),
      itemId: row.item_id,
      url: row.url,
      title: row.title,
      textContent: row.text_content,
      htmlContent: row.html_content,
      publishedAt: row.published_at,
      modifiedAt: row.modified_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  }
}

export default PostRepository

@injectable()
export class PostLoader extends QueryLoader<Post, table.posts> {
  constructor(@inject(DB) db: DatabasePoolType) {
    super(db)
  }

  query: LoaderQueryFn<table.posts> = cond =>
    sql`SELECT * FROM posts WHERE ${cond("posts")}`
  fromRow = PostRepository.fromRow
}
