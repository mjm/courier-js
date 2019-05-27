import { CachingHeaders } from "scrape-feed"
import * as table from "./dbTypes"

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

export interface UserToken {
  sub: UserId
  iss: string
  aud: string[]
  iat: number
  exp: number
  azp: string
  scope: string
}

export interface UserInfo {
  sub: UserId
  name: string
  nickname: string
  picture: string
  updated_at: string
}

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

export type FeedSubscriptionId = string

export interface SubscribedFeed {
  id: FeedSubscriptionId
  feedId: FeedId
  autopost: boolean
  createdAt: Date
  updatedAt: Date
}

export interface FeedInput {
  userId: UserId
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

export type TweetId = string

export interface Tweet {
  id: TweetId
  feedSubscriptionId: FeedSubscriptionId
  postId: PostId
  body: string
  mediaURLs: string[]
  status: TweetStatus
  postedAt: Date | null
  postedTweetID: string | null
}

export type TweetStatus = table.tweet_status

export interface ImportTweetsInput {
  feedSubscriptionId: FeedSubscriptionId
  post: Post
}

export interface NewTweetInput {
  feedSubscriptionId: FeedSubscriptionId
  postId: PostId
  body: string
  mediaURLs: string[]
  position: number
}

export interface UpdateTweetInput {
  id: TweetId
  body: string
  mediaURLs?: string[] | null
}
