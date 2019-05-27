import db, { sql } from "../db"
import {
  Post,
  NewPostInput,
  FeedId,
  PostImportResult,
  UpdatePostInput,
  PagingOptions,
  PostId,
} from "./types"
import { ScrapedEntry } from "scrape-feed"
import countBy from "lodash/countBy"
import { Pager } from "./pager"
import moment from "moment"
import { importTweets } from "./tweet"
import { getFeedSubscriptions } from "./feed"
import { getByIds } from "./util"
import * as table from "./dbTypes"

export function allPostsForFeed(
  feedId: FeedId,
  options: PagingOptions = {}
): Pager<Post, table.posts> {
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

export async function getPostsById(ids: PostId[]): Promise<(Post | null)[]> {
  return await getByIds({
    query: cond => sql`SELECT * FROM posts WHERE ${cond}`,
    ids,
    fromRow,
  })
}

export async function getRecentPosts(feedId: FeedId): Promise<Post[]> {
  const rows = await db.any(sql<table.posts>`
    SELECT *
      FROM posts
     WHERE feed_id = ${feedId}
  ORDER BY published_at DESC
     LIMIT 10
  `)

  return rows.map(fromRow)
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
  const row = await db.maybeOne<table.posts>(sql`
    SELECT * FROM posts
     WHERE feed_id = ${feedId}
       AND item_id = ${itemId}
  `)

  return row && fromRow(row)
}

type CreatePostResult = Pick<table.posts, "id" | "created_at" | "updated_at">

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

  const post = {
    ...input,
    id: id.toString(),
    createdAt: created_at,
    updatedAt: updated_at,
  }

  await createTweets(post)
  return post
}

type UpdatePostResult = Pick<
  table.posts,
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

  const post = {
    ...input,
    feedId: row.feed_id.toString(),
    itemId: row.item_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }

  await createTweets(post)
  return post
}

async function createTweets(post: Post): Promise<void> {
  const subscriptions = await getFeedSubscriptions(post.feedId)

  await Promise.all(
    subscriptions.map(async sub => {
      return await importTweets({
        feedSubscriptionId: sub.id,
        post,
      })
    })
  )
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

export function fromRow(row: table.posts): Post {
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
