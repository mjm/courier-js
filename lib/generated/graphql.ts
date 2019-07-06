import * as types from "../data/types"
import { Pager } from "../data/pager"
export type EnumMap<T extends string, U> = { [K in T]: U }

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

export type AddFeedInput = {
  url: Scalars["String"]
}

export type AddFeedPayload = {
  feed: SubscribedFeed
}

export type CancelTweetInput = {
  id: Scalars["ID"]
}

export type CancelTweetPayload = {
  tweet: Tweet
}

export type DeleteFeedInput = {
  id: Scalars["ID"]
}

export type DeleteFeedPayload = {
  id: Scalars["ID"]
}

export type EditTweetInput = {
  id: Scalars["ID"]
  body: Scalars["String"]
  mediaURLs?: Maybe<Array<Scalars["String"]>>
}

export type EditTweetPayload = {
  tweet: Tweet
}

export type Event = {
  id: Scalars["ID"]
  eventType: EventType
  createdAt: Scalars["DateTime"]
  feed?: Maybe<Feed>
  boolValue?: Maybe<Scalars["Boolean"]>
}

export type EventConnection = {
  edges: Array<EventEdge>
  nodes: Array<Event>
  pageInfo: PageInfo
  totalCount: Scalars["Int"]
}

export type EventEdge = {
  cursor: Scalars["Cursor"]
  node: Event
}

export enum EventType {
  FeedRefresh = "FEED_REFRESH",
  FeedSetAutopost = "FEED_SET_AUTOPOST",
  FeedSubscribe = "FEED_SUBSCRIBE",
  FeedUnsubscribe = "FEED_UNSUBSCRIBE",
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

export type Mutation = {
  addFeed: AddFeedPayload
  refreshFeed: RefreshFeedPayload
  setFeedOptions: SetFeedOptionsPayload
  deleteFeed: DeleteFeedPayload
  cancelTweet: CancelTweetPayload
  uncancelTweet: UncancelTweetPayload
  postTweet: PostTweetPayload
  editTweet: EditTweetPayload
}

export type MutationAddFeedArgs = {
  input: AddFeedInput
}

export type MutationRefreshFeedArgs = {
  input: RefreshFeedInput
}

export type MutationSetFeedOptionsArgs = {
  input: SetFeedOptionsInput
}

export type MutationDeleteFeedArgs = {
  input: DeleteFeedInput
}

export type MutationCancelTweetArgs = {
  input: CancelTweetInput
}

export type MutationUncancelTweetArgs = {
  input: UncancelTweetInput
}

export type MutationPostTweetArgs = {
  input: PostTweetInput
}

export type MutationEditTweetArgs = {
  input: EditTweetInput
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

export type PostTweetInput = {
  id: Scalars["ID"]
  body?: Maybe<Scalars["String"]>
  mediaURLs?: Maybe<Array<Scalars["String"]>>
}

export type PostTweetPayload = {
  tweet: Tweet
}

export type Query = {
  currentUser?: Maybe<User>
  allSubscribedFeeds: SubscribedFeedConnection
  subscribedFeed?: Maybe<SubscribedFeed>
  allTweets: TweetConnection
  allEvents: EventConnection
}

export type QueryAllSubscribedFeedsArgs = {
  first?: Maybe<Scalars["Int"]>
  last?: Maybe<Scalars["Int"]>
  before?: Maybe<Scalars["Cursor"]>
  after?: Maybe<Scalars["Cursor"]>
}

export type QuerySubscribedFeedArgs = {
  id: Scalars["ID"]
}

export type QueryAllTweetsArgs = {
  filter?: Maybe<TweetFilter>
  first?: Maybe<Scalars["Int"]>
  last?: Maybe<Scalars["Int"]>
  before?: Maybe<Scalars["Cursor"]>
  after?: Maybe<Scalars["Cursor"]>
}

export type QueryAllEventsArgs = {
  first?: Maybe<Scalars["Int"]>
  last?: Maybe<Scalars["Int"]>
  before?: Maybe<Scalars["Cursor"]>
  after?: Maybe<Scalars["Cursor"]>
}

export type RefreshFeedInput = {
  id: Scalars["ID"]
}

export type RefreshFeedPayload = {
  feed: Feed
}

export type SetFeedOptionsInput = {
  id: Scalars["ID"]
  autopost?: Maybe<Scalars["Boolean"]>
}

export type SetFeedOptionsPayload = {
  feed: SubscribedFeed
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
  postAfter?: Maybe<Scalars["DateTime"]>
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

export type UncancelTweetInput = {
  id: Scalars["ID"]
}

export type UncancelTweetPayload = {
  tweet: Tweet
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
  EventConnection: Pager<types.Event>
  EventEdge: Omit<EventEdge, "node"> & { node: ResolversTypes["Event"] }
  Event: types.Event
  EventType: EventType
  Mutation: {}
  AddFeedInput: AddFeedInput
  AddFeedPayload: Omit<AddFeedPayload, "feed"> & {
    feed: ResolversTypes["SubscribedFeed"]
  }
  RefreshFeedInput: RefreshFeedInput
  RefreshFeedPayload: Omit<RefreshFeedPayload, "feed"> & {
    feed: ResolversTypes["Feed"]
  }
  SetFeedOptionsInput: SetFeedOptionsInput
  SetFeedOptionsPayload: Omit<SetFeedOptionsPayload, "feed"> & {
    feed: ResolversTypes["SubscribedFeed"]
  }
  DeleteFeedInput: DeleteFeedInput
  DeleteFeedPayload: DeleteFeedPayload
  CancelTweetInput: CancelTweetInput
  CancelTweetPayload: Omit<CancelTweetPayload, "tweet"> & {
    tweet: ResolversTypes["Tweet"]
  }
  UncancelTweetInput: UncancelTweetInput
  UncancelTweetPayload: Omit<UncancelTweetPayload, "tweet"> & {
    tweet: ResolversTypes["Tweet"]
  }
  PostTweetInput: PostTweetInput
  PostTweetPayload: Omit<PostTweetPayload, "tweet"> & {
    tweet: ResolversTypes["Tweet"]
  }
  EditTweetInput: EditTweetInput
  EditTweetPayload: Omit<EditTweetPayload, "tweet"> & {
    tweet: ResolversTypes["Tweet"]
  }
  FeedConnection: Pager<types.Feed>
  FeedEdge: Omit<FeedEdge, "node"> & { node: ResolversTypes["Feed"] }
}

export type AddFeedPayloadResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["AddFeedPayload"]
> = {
  feed?: Resolver<ResolversTypes["SubscribedFeed"], ParentType, ContextType>
}

export type CancelTweetPayloadResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["CancelTweetPayload"]
> = {
  tweet?: Resolver<ResolversTypes["Tweet"], ParentType, ContextType>
}

export interface CursorScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Cursor"], any> {
  name: "Cursor"
}

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["DateTime"], any> {
  name: "DateTime"
}

export type DeleteFeedPayloadResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["DeleteFeedPayload"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>
}

export type EditTweetPayloadResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["EditTweetPayload"]
> = {
  tweet?: Resolver<ResolversTypes["Tweet"], ParentType, ContextType>
}

export type EventResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["Event"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>
  eventType?: Resolver<ResolversTypes["EventType"], ParentType, ContextType>
  createdAt?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>
  feed?: Resolver<Maybe<ResolversTypes["Feed"]>, ParentType, ContextType>
  boolValue?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >
}

export type EventConnectionResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["EventConnection"]
> = {
  edges?: Resolver<Array<ResolversTypes["EventEdge"]>, ParentType, ContextType>
  nodes?: Resolver<Array<ResolversTypes["Event"]>, ParentType, ContextType>
  pageInfo?: Resolver<ResolversTypes["PageInfo"], ParentType, ContextType>
  totalCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>
}

export type EventEdgeResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["EventEdge"]
> = {
  cursor?: Resolver<ResolversTypes["Cursor"], ParentType, ContextType>
  node?: Resolver<ResolversTypes["Event"], ParentType, ContextType>
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
    ResolversTypes["AddFeedPayload"],
    ParentType,
    ContextType,
    MutationAddFeedArgs
  >
  refreshFeed?: Resolver<
    ResolversTypes["RefreshFeedPayload"],
    ParentType,
    ContextType,
    MutationRefreshFeedArgs
  >
  setFeedOptions?: Resolver<
    ResolversTypes["SetFeedOptionsPayload"],
    ParentType,
    ContextType,
    MutationSetFeedOptionsArgs
  >
  deleteFeed?: Resolver<
    ResolversTypes["DeleteFeedPayload"],
    ParentType,
    ContextType,
    MutationDeleteFeedArgs
  >
  cancelTweet?: Resolver<
    ResolversTypes["CancelTweetPayload"],
    ParentType,
    ContextType,
    MutationCancelTweetArgs
  >
  uncancelTweet?: Resolver<
    ResolversTypes["UncancelTweetPayload"],
    ParentType,
    ContextType,
    MutationUncancelTweetArgs
  >
  postTweet?: Resolver<
    ResolversTypes["PostTweetPayload"],
    ParentType,
    ContextType,
    MutationPostTweetArgs
  >
  editTweet?: Resolver<
    ResolversTypes["EditTweetPayload"],
    ParentType,
    ContextType,
    MutationEditTweetArgs
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

export type PostTweetPayloadResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["PostTweetPayload"]
> = {
  tweet?: Resolver<ResolversTypes["Tweet"], ParentType, ContextType>
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
  subscribedFeed?: Resolver<
    Maybe<ResolversTypes["SubscribedFeed"]>,
    ParentType,
    ContextType,
    QuerySubscribedFeedArgs
  >
  allTweets?: Resolver<
    ResolversTypes["TweetConnection"],
    ParentType,
    ContextType,
    QueryAllTweetsArgs
  >
  allEvents?: Resolver<
    ResolversTypes["EventConnection"],
    ParentType,
    ContextType,
    QueryAllEventsArgs
  >
}

export type RefreshFeedPayloadResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["RefreshFeedPayload"]
> = {
  feed?: Resolver<ResolversTypes["Feed"], ParentType, ContextType>
}

export type SetFeedOptionsPayloadResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["SetFeedOptionsPayload"]
> = {
  feed?: Resolver<ResolversTypes["SubscribedFeed"], ParentType, ContextType>
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
  postAfter?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >
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

export type UncancelTweetPayloadResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["UncancelTweetPayload"]
> = {
  tweet?: Resolver<ResolversTypes["Tweet"], ParentType, ContextType>
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
  AddFeedPayload?: AddFeedPayloadResolvers<ContextType>
  CancelTweetPayload?: CancelTweetPayloadResolvers<ContextType>
  Cursor?: GraphQLScalarType
  DateTime?: GraphQLScalarType
  DeleteFeedPayload?: DeleteFeedPayloadResolvers<ContextType>
  EditTweetPayload?: EditTweetPayloadResolvers<ContextType>
  Event?: EventResolvers<ContextType>
  EventConnection?: EventConnectionResolvers<ContextType>
  EventEdge?: EventEdgeResolvers<ContextType>
  Feed?: FeedResolvers<ContextType>
  FeedConnection?: FeedConnectionResolvers<ContextType>
  FeedEdge?: FeedEdgeResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  PageInfo?: PageInfoResolvers<ContextType>
  Post?: PostResolvers<ContextType>
  PostConnection?: PostConnectionResolvers<ContextType>
  PostEdge?: PostEdgeResolvers<ContextType>
  PostTweetPayload?: PostTweetPayloadResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  RefreshFeedPayload?: RefreshFeedPayloadResolvers<ContextType>
  SetFeedOptionsPayload?: SetFeedOptionsPayloadResolvers<ContextType>
  SubscribedFeed?: SubscribedFeedResolvers<ContextType>
  SubscribedFeedConnection?: SubscribedFeedConnectionResolvers<ContextType>
  SubscribedFeedEdge?: SubscribedFeedEdgeResolvers<ContextType>
  Tweet?: TweetResolvers<ContextType>
  TweetConnection?: TweetConnectionResolvers<ContextType>
  TweetEdge?: TweetEdgeResolvers<ContextType>
  UncancelTweetPayload?: UncancelTweetPayloadResolvers<ContextType>
  User?: UserResolvers<ContextType>
}

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = CourierContext> = Resolvers<ContextType>
