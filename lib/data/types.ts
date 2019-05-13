import { CachingHeaders } from "scrape-feed"
import { Pager } from "./pager"

export type PagingOptions =
  | {}
  | {
      first: number
      after?: string | null
    }
  | {
      last: number
      before?: string | null
    }

export type UserId = string

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

export type FeedPager = Pager<Feed, string>

export type FeedSubscriptionId = string

export interface SubscribedFeed {
  id: FeedSubscriptionId
  feed: Feed
  autopost: boolean
  createdAt: Date
  updatedAt: Date
}

export type SubscribedFeedPager = Pager<SubscribedFeed, string>

// Aliases to prevent GraphQL collisions
export type DBFeed = Feed
export type DBSubscribedFeed = SubscribedFeed

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

export type PostPager = Pager<Post, Date>
export type DBPost = Post

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
