import * as types from "../data/types"
import { Pager } from "../data/pager"

export type Maybe<T> = T | null
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Cursor: string
  DateTime: Date
}

export type Feed = {
  id: Scalars["ID"]
  url: Scalars["String"]
  title: Scalars["String"]
  homePageURL: Scalars["String"]
  refreshedAt?: Maybe<Scalars["DateTime"]>
  createdAt: Scalars["DateTime"]
  updatedAt: Scalars["DateTime"]
  posts: PostConnection
}

export type FeedPostsArgs = {
  first?: Maybe<Scalars["Int"]>
  last?: Maybe<Scalars["Int"]>
  before?: Maybe<Scalars["Cursor"]>
  after?: Maybe<Scalars["Cursor"]>
}

export type FeedConnection = {
  edges: Array<FeedEdge>
  nodes: Array<Feed>
  pageInfo: PageInfo
  totalCount: Scalars["Int"]
}

export type FeedEdge = {
  cursor: Scalars["Cursor"]
  node: Feed
}

export type FeedInput = {
  url: Scalars["String"]
}

export type Mutation = {
  addFeed: SubscribedFeed
  refreshFeed: Feed
  deleteFeed: Scalars["ID"]
  cancelTweet: Tweet
  uncancelTweet: Tweet
  postTweet: Tweet
}

export type MutationAddFeedArgs = {
  feed: FeedInput
}

export type MutationRefreshFeedArgs = {
  id: Scalars["ID"]
}

export type MutationDeleteFeedArgs = {
  id: Scalars["ID"]
}

export type MutationCancelTweetArgs = {
  id: Scalars["ID"]
}

export type MutationUncancelTweetArgs = {
  id: Scalars["ID"]
}

export type MutationPostTweetArgs = {
  id: Scalars["ID"]
}

export type PageInfo = {
  startCursor?: Maybe<Scalars["Cursor"]>
  endCursor?: Maybe<Scalars["Cursor"]>
  hasNextPage: Scalars["Boolean"]
  hasPreviousPage: Scalars["Boolean"]
}

export type Post = {
  id: Scalars["ID"]
  feed: Feed
  itemId: Scalars["String"]
  url: Scalars["String"]
  title: Scalars["String"]
  textContent: Scalars["String"]
  htmlContent: Scalars["String"]
  publishedAt?: Maybe<Scalars["DateTime"]>
  modifiedAt?: Maybe<Scalars["DateTime"]>
  createdAt: Scalars["DateTime"]
  updatedAt: Scalars["DateTime"]
}

export type PostConnection = {
  edges: Array<PostEdge>
  nodes: Array<Post>
  pageInfo: PageInfo
  totalCount: Scalars["Int"]
}

export type PostEdge = {
  cursor: Scalars["Cursor"]
  node: Post
}

export type Query = {
  currentUser?: Maybe<User>
  allSubscribedFeeds: SubscribedFeedConnection
  allTweets: TweetConnection
  allFeeds: FeedConnection
  feed?: Maybe<Feed>
}

export type QueryAllSubscribedFeedsArgs = {
  first?: Maybe<Scalars["Int"]>
  last?: Maybe<Scalars["Int"]>
  before?: Maybe<Scalars["Cursor"]>
  after?: Maybe<Scalars["Cursor"]>
}

export type QueryAllTweetsArgs = {
  filter?: Maybe<TweetFilter>
  first?: Maybe<Scalars["Int"]>
  last?: Maybe<Scalars["Int"]>
  before?: Maybe<Scalars["Cursor"]>
  after?: Maybe<Scalars["Cursor"]>
}

export type QueryAllFeedsArgs = {
  first?: Maybe<Scalars["Int"]>
  last?: Maybe<Scalars["Int"]>
  before?: Maybe<Scalars["Cursor"]>
  after?: Maybe<Scalars["Cursor"]>
}

export type QueryFeedArgs = {
  id: Scalars["ID"]
}

export type SubscribedFeed = {
  id: Scalars["ID"]
  feed: Feed
  autopost: Scalars["Boolean"]
}

export type SubscribedFeedConnection = {
  edges: Array<SubscribedFeedEdge>
  nodes: Array<SubscribedFeed>
  pageInfo: PageInfo
  totalCount: Scalars["Int"]
}

export type SubscribedFeedEdge = {
  cursor: Scalars["Cursor"]
  node: SubscribedFeed
}

export type Tweet = {
  id: Scalars["ID"]
  feed: SubscribedFeed
  post: Post
  body: Scalars["String"]
  mediaURLs: Array<Scalars["String"]>
  status: TweetStatus
  postedAt?: Maybe<Scalars["DateTime"]>
  postedTweetID?: Maybe<Scalars["String"]>
}

export type TweetConnection = {
  edges: Array<TweetEdge>
  nodes: Array<Tweet>
  pageInfo: PageInfo
  totalCount: Scalars["Int"]
}

export type TweetEdge = {
  cursor: Scalars["Cursor"]
  node: Tweet
}

export enum TweetFilter {
  Upcoming = "UPCOMING",
  Past = "PAST",
}

export enum TweetStatus {
  Draft = "DRAFT",
  Canceled = "CANCELED",
  Posted = "POSTED",
}

export type User = {
  name: Scalars["String"]
  nickname: Scalars["String"]
  picture: Scalars["String"]
}
import { CourierContext } from "../context"

import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from "graphql"

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs>
  resolve?: SubscriptionResolveFn<TResult, TParent, TContext, TArgs>
}

export type SubscriptionResolver<
  TResult,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionResolverObject<TResult, TParent, TContext, TArgs>)
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: {}
  User: User
  String: Scalars["String"]
  Int: Scalars["Int"]
  Cursor: Scalars["Cursor"]
  SubscribedFeedConnection: Pager<types.SubscribedFeed>
  SubscribedFeedEdge: Omit<SubscribedFeedEdge, "node"> & {
    node: ResolversTypes["SubscribedFeed"]
  }
  SubscribedFeed: types.SubscribedFeed
  ID: Scalars["ID"]
  Feed: types.Feed
  DateTime: Scalars["DateTime"]
  PostConnection: Pager<types.Post>
  PostEdge: Omit<PostEdge, "node"> & { node: ResolversTypes["Post"] }
  Post: types.Post
  PageInfo: PageInfo
  Boolean: Scalars["Boolean"]
  TweetFilter: TweetFilter
  TweetConnection: Pager<types.Tweet>
  TweetEdge: Omit<TweetEdge, "node"> & { node: ResolversTypes["Tweet"] }
  Tweet: types.Tweet
  TweetStatus: TweetStatus
  FeedConnection: Pager<types.Feed>
  FeedEdge: Omit<FeedEdge, "node"> & { node: ResolversTypes["Feed"] }
  Mutation: {}
  FeedInput: FeedInput
}

export interface CursorScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Cursor"], any> {
  name: "Cursor"
}

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["DateTime"], any> {
  name: "DateTime"
}

export type FeedResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["Feed"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>
  url?: Resolver<ResolversTypes["String"], ParentType, ContextType>
  title?: Resolver<ResolversTypes["String"], ParentType, ContextType>
  homePageURL?: Resolver<ResolversTypes["String"], ParentType, ContextType>
  refreshedAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >
  createdAt?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>
  updatedAt?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>
  posts?: Resolver<
    ResolversTypes["PostConnection"],
    ParentType,
    ContextType,
    FeedPostsArgs
  >
}

export type FeedConnectionResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["FeedConnection"]
> = {
  edges?: Resolver<Array<ResolversTypes["FeedEdge"]>, ParentType, ContextType>
  nodes?: Resolver<Array<ResolversTypes["Feed"]>, ParentType, ContextType>
  pageInfo?: Resolver<ResolversTypes["PageInfo"], ParentType, ContextType>
  totalCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>
}

export type FeedEdgeResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["FeedEdge"]
> = {
  cursor?: Resolver<ResolversTypes["Cursor"], ParentType, ContextType>
  node?: Resolver<ResolversTypes["Feed"], ParentType, ContextType>
}

export type MutationResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["Mutation"]
> = {
  addFeed?: Resolver<
    ResolversTypes["SubscribedFeed"],
    ParentType,
    ContextType,
    MutationAddFeedArgs
  >
  refreshFeed?: Resolver<
    ResolversTypes["Feed"],
    ParentType,
    ContextType,
    MutationRefreshFeedArgs
  >
  deleteFeed?: Resolver<
    ResolversTypes["ID"],
    ParentType,
    ContextType,
    MutationDeleteFeedArgs
  >
  cancelTweet?: Resolver<
    ResolversTypes["Tweet"],
    ParentType,
    ContextType,
    MutationCancelTweetArgs
  >
  uncancelTweet?: Resolver<
    ResolversTypes["Tweet"],
    ParentType,
    ContextType,
    MutationUncancelTweetArgs
  >
  postTweet?: Resolver<
    ResolversTypes["Tweet"],
    ParentType,
    ContextType,
    MutationPostTweetArgs
  >
}

export type PageInfoResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["PageInfo"]
> = {
  startCursor?: Resolver<
    Maybe<ResolversTypes["Cursor"]>,
    ParentType,
    ContextType
  >
  endCursor?: Resolver<Maybe<ResolversTypes["Cursor"]>, ParentType, ContextType>
  hasNextPage?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>
  hasPreviousPage?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>
}

export type PostResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["Post"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>
  feed?: Resolver<ResolversTypes["Feed"], ParentType, ContextType>
  itemId?: Resolver<ResolversTypes["String"], ParentType, ContextType>
  url?: Resolver<ResolversTypes["String"], ParentType, ContextType>
  title?: Resolver<ResolversTypes["String"], ParentType, ContextType>
  textContent?: Resolver<ResolversTypes["String"], ParentType, ContextType>
  htmlContent?: Resolver<ResolversTypes["String"], ParentType, ContextType>
  publishedAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >
  modifiedAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >
  createdAt?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>
  updatedAt?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>
}

export type PostConnectionResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["PostConnection"]
> = {
  edges?: Resolver<Array<ResolversTypes["PostEdge"]>, ParentType, ContextType>
  nodes?: Resolver<Array<ResolversTypes["Post"]>, ParentType, ContextType>
  pageInfo?: Resolver<ResolversTypes["PageInfo"], ParentType, ContextType>
  totalCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>
}

export type PostEdgeResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["PostEdge"]
> = {
  cursor?: Resolver<ResolversTypes["Cursor"], ParentType, ContextType>
  node?: Resolver<ResolversTypes["Post"], ParentType, ContextType>
}

export type QueryResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["Query"]
> = {
  currentUser?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>
  allSubscribedFeeds?: Resolver<
    ResolversTypes["SubscribedFeedConnection"],
    ParentType,
    ContextType,
    QueryAllSubscribedFeedsArgs
  >
  allTweets?: Resolver<
    ResolversTypes["TweetConnection"],
    ParentType,
    ContextType,
    QueryAllTweetsArgs
  >
  allFeeds?: Resolver<
    ResolversTypes["FeedConnection"],
    ParentType,
    ContextType,
    QueryAllFeedsArgs
  >
  feed?: Resolver<
    Maybe<ResolversTypes["Feed"]>,
    ParentType,
    ContextType,
    QueryFeedArgs
  >
}

export type SubscribedFeedResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["SubscribedFeed"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>
  feed?: Resolver<ResolversTypes["Feed"], ParentType, ContextType>
  autopost?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>
}

export type SubscribedFeedConnectionResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["SubscribedFeedConnection"]
> = {
  edges?: Resolver<
    Array<ResolversTypes["SubscribedFeedEdge"]>,
    ParentType,
    ContextType
  >
  nodes?: Resolver<
    Array<ResolversTypes["SubscribedFeed"]>,
    ParentType,
    ContextType
  >
  pageInfo?: Resolver<ResolversTypes["PageInfo"], ParentType, ContextType>
  totalCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>
}

export type SubscribedFeedEdgeResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["SubscribedFeedEdge"]
> = {
  cursor?: Resolver<ResolversTypes["Cursor"], ParentType, ContextType>
  node?: Resolver<ResolversTypes["SubscribedFeed"], ParentType, ContextType>
}

export type TweetResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["Tweet"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>
  feed?: Resolver<ResolversTypes["SubscribedFeed"], ParentType, ContextType>
  post?: Resolver<ResolversTypes["Post"], ParentType, ContextType>
  body?: Resolver<ResolversTypes["String"], ParentType, ContextType>
  mediaURLs?: Resolver<Array<ResolversTypes["String"]>, ParentType, ContextType>
  status?: Resolver<ResolversTypes["TweetStatus"], ParentType, ContextType>
  postedAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >
  postedTweetID?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >
}

export type TweetConnectionResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["TweetConnection"]
> = {
  edges?: Resolver<Array<ResolversTypes["TweetEdge"]>, ParentType, ContextType>
  nodes?: Resolver<Array<ResolversTypes["Tweet"]>, ParentType, ContextType>
  pageInfo?: Resolver<ResolversTypes["PageInfo"], ParentType, ContextType>
  totalCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>
}

export type TweetEdgeResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["TweetEdge"]
> = {
  cursor?: Resolver<ResolversTypes["Cursor"], ParentType, ContextType>
  node?: Resolver<ResolversTypes["Tweet"], ParentType, ContextType>
}

export type UserResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["User"]
> = {
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>
  nickname?: Resolver<ResolversTypes["String"], ParentType, ContextType>
  picture?: Resolver<ResolversTypes["String"], ParentType, ContextType>
}

export type Resolvers<ContextType = CourierContext> = {
  Cursor?: GraphQLScalarType
  DateTime?: GraphQLScalarType
  Feed?: FeedResolvers<ContextType>
  FeedConnection?: FeedConnectionResolvers<ContextType>
  FeedEdge?: FeedEdgeResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  PageInfo?: PageInfoResolvers<ContextType>
  Post?: PostResolvers<ContextType>
  PostConnection?: PostConnectionResolvers<ContextType>
  PostEdge?: PostEdgeResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  SubscribedFeed?: SubscribedFeedResolvers<ContextType>
  SubscribedFeedConnection?: SubscribedFeedConnectionResolvers<ContextType>
  SubscribedFeedEdge?: SubscribedFeedEdgeResolvers<ContextType>
  Tweet?: TweetResolvers<ContextType>
  TweetConnection?: TweetConnectionResolvers<ContextType>
  TweetEdge?: TweetEdgeResolvers<ContextType>
  User?: UserResolvers<ContextType>
}

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = CourierContext> = Resolvers<ContextType>
