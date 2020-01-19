import { sql, DatabasePoolType } from "../db"
import * as table from "../data/dbTypes"
import {
  FeedId,
  PagingOptions,
  Post,
  PostId,
  NewPostInput,
  UpdatePostInput,
} from "../data/types"
import { Pager } from "../data/pager"
import moment from "moment"
import { injectable, inject } from "inversify"
import { LoaderQueryFn, QueryLoader } from "../data/loader"
import { DB } from "../key"

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
