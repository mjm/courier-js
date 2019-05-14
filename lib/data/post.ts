import db, { sql } from "../db"
import {
  Post,
  NewPostInput,
  FeedId,
  PostImportResult,
  UpdatePostInput,
  PagingOptions,
} from "./types"
import { ScrapedEntry } from "scrape-feed"
import countBy from "lodash/countBy"
import { Pager } from "./pager"
import moment from "moment"

export function allPostsForFeed(
  feedId: FeedId,
  options: PagingOptions = {}
): Pager<Post, PostRow> {
  return new Pager({
    query: sql`SELECT * FROM posts WHERE feed_id = ${feedId}`,
    orderColumn: "published_at",
    totalQuery: sql`SELECT COUNT(*) FROM posts WHERE feed_id = ${feedId}`,
    variables: options,
    makeEdge(row) {
      return {
        node: fromRow(row),
        // TODO oh no what if the published_at is NULL
        cursor: row.published_at ? moment.utc(row.published_at).format() : "",
      }
    },
    getCursorValue(cursor) {
      return cursor || null
    },
  })
}

type ImportResultType = "created" | "updated" | "unchanged"

export async function importPosts(
  feedId: FeedId,
  entries: ScrapedEntry[]
): Promise<PostImportResult> {
  const importPromises = entries.map(entry => importPost(feedId, entry))
  const imports = await Promise.all(importPromises)

  // Ensure that we have zeros for any types that aren't used
  const defaultResult = { created: 0, updated: 0, unchanged: 0 }
  return { ...defaultResult, ...countBy(imports) }
}

export async function importPost(
  feedId: FeedId,
  entry: ScrapedEntry
): Promise<ImportResultType> {
  const existingPost = await getPostByItemId(feedId, entry.id)
  if (existingPost) {
    const input: UpdatePostInput = {
      id: existingPost.id,
      title: entry.title,
      url: entry.url,
      textContent: entry.textContent,
      htmlContent: entry.htmlContent,
      publishedAt: entry.publishedAt,
      modifiedAt: entry.modifiedAt,
    }

    if (!hasChanges(input, existingPost)) {
      return "unchanged"
    }

    await updatePost(input)
    return "updated"
  } else {
    const input: NewPostInput = {
      feedId,
      itemId: entry.id,
      title: entry.title,
      url: entry.url,
      textContent: entry.textContent,
      htmlContent: entry.htmlContent,
      publishedAt: entry.publishedAt,
      modifiedAt: entry.modifiedAt,
    }

    await createPost(input)
    return "created"
  }
}

async function getPostByItemId(
  feedId: FeedId,
  itemId: string
): Promise<Post | null> {
  const row = await db.maybeOne<PostRow>(sql`
    SELECT * FROM posts
     WHERE feed_id = ${feedId}
       AND item_id = ${itemId}
  `)

  return row && fromRow(row)
}

type CreatePostResult = Pick<PostRow, "id" | "created_at" | "updated_at">

export async function createPost(input: NewPostInput): Promise<Post> {
  const { id, created_at, updated_at } = await db.one<CreatePostResult>(sql`
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
    RETURNING id, created_at, updated_at
  `)

  return {
    ...input,
    id,
    createdAt: created_at,
    updatedAt: updated_at,
  }
}

type UpdatePostResult = Pick<
  PostRow,
  "feed_id" | "item_id" | "created_at" | "updated_at"
>

async function updatePost(input: UpdatePostInput): Promise<Post> {
  const row = await db.one<UpdatePostResult>(sql`
    UPDATE posts
       SET url = ${input.url},
           title = ${input.title},
           text_content = ${input.textContent},
           html_content = ${input.htmlContent},
           published_at = ${input.publishedAt &&
             input.publishedAt.toISOString()},
           modified_at = ${input.modifiedAt && input.modifiedAt.toISOString()},
           updated_at = CURRENT_TIMESTAMP
     WHERE id = ${input.id}
    RETURNING feed_id, item_id, created_at, updated_at
  `)

  return {
    ...input,
    feedId: row.feed_id,
    itemId: row.item_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function hasChanges(input: UpdatePostInput, existingPost: Post): boolean {
  return (
    input.title !== existingPost.title ||
    input.url !== existingPost.url ||
    input.textContent !== existingPost.textContent ||
    input.htmlContent !== existingPost.htmlContent ||
    !isSameDate(input.publishedAt, existingPost.publishedAt) ||
    !isSameDate(input.modifiedAt, existingPost.modifiedAt)
  )
}

function isSameDate(d1: Date | null, d2: Date | null): boolean {
  if (!d1) {
    return !d2
  }
  if (!d2) {
    return false
  }

  return d1.getTime() === d2.getTime()
}

export interface PostRow {
  id: string
  feed_id: string
  item_id: string
  url: string
  title: string
  text_content: string
  html_content: string
  published_at: Date | null
  modified_at: Date | null
  created_at: Date
  updated_at: Date
}

export function fromRow(row: PostRow): Post {
  return {
    id: row.id,
    feedId: row.feed_id,
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
