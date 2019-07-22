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
  "https://courier.blog/customer_id"?: string
  "https://courier.blog/subscription_id"?: string
  "https://courier.blog/status"?: string
}

export interface UserInfo {
  sub: UserId
  name: string
  nickname: string
  picture: string
  updated_at: string
  stripe_customer_id: string | undefined
  stripe_subscription_id: string | undefined
  subscription_status: "active" | undefined
}

export interface UserAppMetadata {
  stripe_customer_id?: string
  stripe_subscription_id?: string
  subscription_status?: "active" | undefined
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
  userId: UserId
  feedId: FeedId
  autopost: boolean
  createdAt: Date
  updatedAt: Date
}

export interface FeedInput {
  userId: UserId
  url: string
}

export interface UpdateFeedOptionsInput {
  id: FeedSubscriptionId
  autopost?: boolean | null
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
  postAfter: Date | null
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
  autopost: boolean
}

export interface UpdateTweetInput {
  body: string
  mediaURLs?: string[] | null
}

export type EventId = string

export type EventType =
  | "feed_refresh"
  | "feed_set_autopost"
  | "feed_subscribe"
  | "feed_unsubscribe"
  | "tweet_cancel"
  | "tweet_uncancel"
  | "tweet_edit"
  | "tweet_post"
  | "tweet_autopost"
  | "subscription_create"
  | "subscription_renew"
  | "subscription_cancel"
  | "subscription_reactivate"
  | "subscription_expire"

export interface Event {
  id: EventId
  userId: UserId | null
  eventType: EventType
  parameters: Object
  createdAt: Date
}

export interface NewEventInput {
  eventType: EventType
  parameters: Object
}
