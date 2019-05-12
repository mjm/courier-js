import db from "../db"
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
): Pager<Post, Date> {
  return new Pager({
    query: `SELECT * FROM posts WHERE feed_id = $1`,
    args: [feedId],
    orderColumn: "published_at",
    totalQuery: `SELECT COUNT(*) FROM posts WHERE feed_id = $1`,
    variables: options,
    makeEdge(row) {
      return {
        node: fromRow(row),
        cursor: moment.utc(row.published_at).format(),
      }
    },
    getCursorValue(cursor) {
      return moment.utc(cursor).toDate()
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
  const { rows } = await db.query(
    `SELECT * FROM posts
      WHERE feed_id = $1
        AND item_id = $2
      LIMIT 1`,
    [feedId, itemId]
  )

  if (rows.length) {
    const row: PostRow = rows[0]
    return fromRow(row)
  } else {
    return null
  }
}

export async function createPost(input: NewPostInput): Promise<Post> {
  const { rows } = await db.query(
    `INSERT INTO posts(
      feed_id,
      item_id,
      url,
      title,
      text_content,
      html_content,
      published_at,
      modified_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8
    ) RETURNING (id, created_at, updated_at)`,
    [
      input.feedId,
      input.itemId,
      input.url,
      input.title,
      input.textContent,
      input.htmlContent,
      input.publishedAt,
      input.modifiedAt,
    ]
  )

  const { id, created_at, updated_at } = rows[0]

  return {
    ...input,
    id,
    createdAt: created_at,
    updatedAt: updated_at,
  }
}

async function updatePost(input: UpdatePostInput): Promise<Post> {
  const { rows } = await db.query(
    `UPDATE posts
        SET url = $2,
            title = $3,
            text_content = $4,
            html_content = $5,
            published_at = $6,
            modified_at = $7,
            updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    RETURNING feed_id, item_id, created_at, updated_at`,
    [
      input.id,
      input.url,
      input.title,
      input.textContent,
      input.htmlContent,
      input.publishedAt,
      input.modifiedAt,
    ]
  )

  const row = rows[0]
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

interface PostRow {
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

function fromRow(row: PostRow): Post {
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
