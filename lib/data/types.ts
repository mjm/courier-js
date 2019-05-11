import { CachingHeaders } from "scrape-feed"

export type FeedId = string

export interface Feed {
  id: FeedId
  url: string
  title: string
  homePageURL: string
  cachingHeaders: CachingHeaders | null
  refreshedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface FeedInput {
  url: string
}

export type PostId = string

export interface Post {
  id: PostId
  feedId: FeedId
  itemId: string
  url: string
  title: string
  textContent: string
  htmlContent: string
  publishedAt: Date | null
  modifiedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface NewPostInput {
  feedId: FeedId
  itemId: string
  url: string
  title: string
  textContent: string
  htmlContent: string
  publishedAt: Date | null
  modifiedAt: Date | null
}

export interface UpdatePostInput {
  id: PostId
  url: string
  title: string
  textContent: string
  htmlContent: string
  publishedAt: Date | null
  modifiedAt: Date | null
}

export interface PostImportResult {
  created: number
  updated: number
  unchanged: number
}
