import * as types from "../data/types"
import { Pager } from "../data/pager"
import Stripe from "stripe"
import { MicroformatDocument } from "microformat-node"
export type EnumMap<T extends string, U> = { [K in T]: U }

export type Maybe<T> = T | null
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  DateTime: Date
  Cursor: string
}

export type AddDeviceInput = {
  token: Scalars["String"]
  environment?: Maybe<NotificationEnvironment>
}

export type AddDevicePayload = {
  deviceToken: DeviceToken
}

export type AddFeedInput = {
  url: Scalars["String"]
}

export type AddFeedPayload = {
  feed: SubscribedFeed
}

export type CancelSubscriptionInput = {
  placeholder?: Maybe<Scalars["String"]>
}

export type CancelSubscriptionPayload = {
  user: User
}

export type CancelTweetInput = {
  id: Scalars["ID"]
}

export type CancelTweetPayload = {
  tweet: Tweet
}

export type CreditCard = {
  brand: Scalars["String"]
  lastFour: Scalars["String"]
  expirationMonth: Scalars["Int"]
  expirationYear: Scalars["Int"]
}

export type Customer = {
  emailAddress?: Maybe<Scalars["String"]>
  creditCard?: Maybe<CreditCard>
}

export type DeleteFeedInput = {
  id: Scalars["ID"]
}

export type DeleteFeedPayload = {
  id: Scalars["ID"]
}

export type DeviceToken = {
  id: Scalars["ID"]
  token: Scalars["String"]
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
  tweet?: Maybe<Tweet>
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
  TweetCancel = "TWEET_CANCEL",
  TweetUncancel = "TWEET_UNCANCEL",
  TweetEdit = "TWEET_EDIT",
  TweetPost = "TWEET_POST",
  TweetAutopost = "TWEET_AUTOPOST",
  SubscriptionCreate = "SUBSCRIPTION_CREATE",
  SubscriptionRenew = "SUBSCRIPTION_RENEW",
  SubscriptionCancel = "SUBSCRIPTION_CANCEL",
  SubscriptionReactivate = "SUBSCRIPTION_REACTIVATE",
  SubscriptionExpire = "SUBSCRIPTION_EXPIRE",
}

export type Feed = {
  id: Scalars["ID"]
  url: Scalars["String"]
  title: Scalars["String"]
  homePageURL: Scalars["String"]
  micropubEndpoint: Scalars["String"]
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

export type MicroformatPage = {
  authorizationEndpoint?: Maybe<Scalars["String"]>
  tokenEndpoint?: Maybe<Scalars["String"]>
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
  subscribe: SubscribePayload
  cancelSubscription: CancelSubscriptionPayload
  addDevice: AddDevicePayload
  sendTestNotification: SendTestNotificationPayload
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

export type MutationSubscribeArgs = {
  input: SubscribeInput
}

export type MutationCancelSubscriptionArgs = {
  input: CancelSubscriptionInput
}

export type MutationAddDeviceArgs = {
  input: AddDeviceInput
}

export type MutationSendTestNotificationArgs = {
  input: SendTestNotificationInput
}

export enum NotificationEnvironment {
  Production = "PRODUCTION",
  Sandbox = "SANDBOX",
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
  viewer?: Maybe<User>
  allSubscribedFeeds: SubscribedFeedConnection
  subscribedFeed?: Maybe<SubscribedFeed>
  allTweets: TweetConnection
  tweet?: Maybe<Tweet>
  allEvents: EventConnection
  microformats?: Maybe<MicroformatPage>
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

export type QueryTweetArgs = {
  id: Scalars["ID"]
}

export type QueryAllEventsArgs = {
  first?: Maybe<Scalars["Int"]>
  last?: Maybe<Scalars["Int"]>
  before?: Maybe<Scalars["Cursor"]>
  after?: Maybe<Scalars["Cursor"]>
}

export type QueryMicroformatsArgs = {
  url: Scalars["String"]
}

export type RefreshFeedInput = {
  id: Scalars["ID"]
}

export type RefreshFeedPayload = {
  feed: Feed
}

export type SendTestNotificationInput = {
  tweetId: Scalars["ID"]
  type?: Maybe<TestNotificationType>
}

export type SendTestNotificationPayload = {
  placeholder?: Maybe<Scalars["String"]>
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

export type SubscribeInput = {
  tokenID?: Maybe<Scalars["ID"]>
  email?: Maybe<Scalars["String"]>
}

export type SubscribePayload = {
  user: User
}

export enum SubscriptionStatus {
  Active = "ACTIVE",
  Canceled = "CANCELED",
  Expired = "EXPIRED",
  Inactive = "INACTIVE",
}

export enum TestNotificationType {
  Imported = "IMPORTED",
  Posted = "POSTED",
}

export type Tweet = {
  id: Scalars["ID"]
  feed: SubscribedFeed
  post: Post
  action: TweetAction
  body: Scalars["String"]
  mediaURLs: Array<Scalars["String"]>
  retweetID: Scalars["String"]
  status: TweetStatus
  postAfter?: Maybe<Scalars["DateTime"]>
  postedAt?: Maybe<Scalars["DateTime"]>
  postedTweetID?: Maybe<Scalars["String"]>
}

export enum TweetAction {
  Tweet = "TWEET",
  Retweet = "RETWEET",
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
  customer?: Maybe<Customer>
  subscription?: Maybe<UserSubscription>
  subscriptionStatusOverride?: Maybe<SubscriptionStatus>
  micropubSites: Array<Scalars["String"]>
  allTweets: TweetConnection
}

export type UserAllTweetsArgs = {
  filter?: Maybe<TweetFilter>
  first?: Maybe<Scalars["Int"]>
  last?: Maybe<Scalars["Int"]>
  before?: Maybe<Scalars["Cursor"]>
  after?: Maybe<Scalars["Cursor"]>
}

export type UserSubscription = {
  status: SubscriptionStatus
  periodEnd: Scalars["DateTime"]
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
  User: types.UserInfo
  String: Scalars["String"]
  Customer: Stripe.customers.ICustomer
  CreditCard: Stripe.cards.ICard
  Int: Scalars["Int"]
  UserSubscription: Stripe.subscriptions.ISubscription
  SubscriptionStatus: SubscriptionStatus
  DateTime: Scalars["DateTime"]
  TweetFilter: TweetFilter
  Cursor: Scalars["Cursor"]
  TweetConnection: Pager<types.Tweet>
  TweetEdge: Omit<TweetEdge, "node"> & { node: ResolversTypes["Tweet"] }
  Tweet: types.Tweet
  ID: Scalars["ID"]
  SubscribedFeed: types.SubscribedFeed
  Feed: types.Feed
  PostConnection: Pager<types.Post>
  PostEdge: Omit<PostEdge, "node"> & { node: ResolversTypes["Post"] }
  Post: types.Post
  PageInfo: PageInfo
  Boolean: Scalars["Boolean"]
  TweetAction: TweetAction
  TweetStatus: TweetStatus
  SubscribedFeedConnection: Pager<types.SubscribedFeed>
  SubscribedFeedEdge: Omit<SubscribedFeedEdge, "node"> & {
    node: ResolversTypes["SubscribedFeed"]
  }
  EventConnection: Pager<types.Event>
  EventEdge: Omit<EventEdge, "node"> & { node: ResolversTypes["Event"] }
  Event: types.Event
  EventType: EventType
  MicroformatPage: MicroformatDocument
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
  SubscribeInput: SubscribeInput
  SubscribePayload: Omit<SubscribePayload, "user"> & {
    user: ResolversTypes["User"]
  }
  CancelSubscriptionInput: CancelSubscriptionInput
  CancelSubscriptionPayload: Omit<CancelSubscriptionPayload, "user"> & {
    user: ResolversTypes["User"]
  }
  AddDeviceInput: AddDeviceInput
  NotificationEnvironment: NotificationEnvironment
  AddDevicePayload: AddDevicePayload
  DeviceToken: DeviceToken
  SendTestNotificationInput: SendTestNotificationInput
  TestNotificationType: TestNotificationType
  SendTestNotificationPayload: SendTestNotificationPayload
  FeedConnection: Pager<types.Feed>
  FeedEdge: Omit<FeedEdge, "node"> & { node: ResolversTypes["Feed"] }
}

export type AddDevicePayloadResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["AddDevicePayload"]
> = {
  deviceToken?: Resolver<ResolversTypes["DeviceToken"], ParentType, ContextType>
}

export type AddFeedPayloadResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["AddFeedPayload"]
> = {
  feed?: Resolver<ResolversTypes["SubscribedFeed"], ParentType, ContextType>
}

export type CancelSubscriptionPayloadResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["CancelSubscriptionPayload"]
> = {
  user?: Resolver<ResolversTypes["User"], ParentType, ContextType>
}

export type CancelTweetPayloadResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["CancelTweetPayload"]
> = {
  tweet?: Resolver<ResolversTypes["Tweet"], ParentType, ContextType>
}

export type CreditCardResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["CreditCard"]
> = {
  brand?: Resolver<ResolversTypes["String"], ParentType, ContextType>
  lastFour?: Resolver<ResolversTypes["String"], ParentType, ContextType>
  expirationMonth?: Resolver<ResolversTypes["Int"], ParentType, ContextType>
  expirationYear?: Resolver<ResolversTypes["Int"], ParentType, ContextType>
}

export interface CursorScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Cursor"], any> {
  name: "Cursor"
}

export type CustomerResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["Customer"]
> = {
  emailAddress?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >
  creditCard?: Resolver<
    Maybe<ResolversTypes["CreditCard"]>,
    ParentType,
    ContextType
  >
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

export type DeviceTokenResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["DeviceToken"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>
  token?: Resolver<ResolversTypes["String"], ParentType, ContextType>
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
  tweet?: Resolver<Maybe<ResolversTypes["Tweet"]>, ParentType, ContextType>
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
  micropubEndpoint?: Resolver<ResolversTypes["String"], ParentType, ContextType>
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

export type MicroformatPageResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["MicroformatPage"]
> = {
  authorizationEndpoint?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >
  tokenEndpoint?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >
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
  subscribe?: Resolver<
    ResolversTypes["SubscribePayload"],
    ParentType,
    ContextType,
    MutationSubscribeArgs
  >
  cancelSubscription?: Resolver<
    ResolversTypes["CancelSubscriptionPayload"],
    ParentType,
    ContextType,
    MutationCancelSubscriptionArgs
  >
  addDevice?: Resolver<
    ResolversTypes["AddDevicePayload"],
    ParentType,
    ContextType,
    MutationAddDeviceArgs
  >
  sendTestNotification?: Resolver<
    ResolversTypes["SendTestNotificationPayload"],
    ParentType,
    ContextType,
    MutationSendTestNotificationArgs
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
  viewer?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>
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
  tweet?: Resolver<
    Maybe<ResolversTypes["Tweet"]>,
    ParentType,
    ContextType,
    QueryTweetArgs
  >
  allEvents?: Resolver<
    ResolversTypes["EventConnection"],
    ParentType,
    ContextType,
    QueryAllEventsArgs
  >
  microformats?: Resolver<
    Maybe<ResolversTypes["MicroformatPage"]>,
    ParentType,
    ContextType,
    QueryMicroformatsArgs
  >
}

export type RefreshFeedPayloadResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["RefreshFeedPayload"]
> = {
  feed?: Resolver<ResolversTypes["Feed"], ParentType, ContextType>
}

export type SendTestNotificationPayloadResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["SendTestNotificationPayload"]
> = {
  placeholder?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >
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

export type SubscribePayloadResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["SubscribePayload"]
> = {
  user?: Resolver<ResolversTypes["User"], ParentType, ContextType>
}

export type TweetResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["Tweet"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>
  feed?: Resolver<ResolversTypes["SubscribedFeed"], ParentType, ContextType>
  post?: Resolver<ResolversTypes["Post"], ParentType, ContextType>
  action?: Resolver<ResolversTypes["TweetAction"], ParentType, ContextType>
  body?: Resolver<ResolversTypes["String"], ParentType, ContextType>
  mediaURLs?: Resolver<Array<ResolversTypes["String"]>, ParentType, ContextType>
  retweetID?: Resolver<ResolversTypes["String"], ParentType, ContextType>
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
  customer?: Resolver<
    Maybe<ResolversTypes["Customer"]>,
    ParentType,
    ContextType
  >
  subscription?: Resolver<
    Maybe<ResolversTypes["UserSubscription"]>,
    ParentType,
    ContextType
  >
  subscriptionStatusOverride?: Resolver<
    Maybe<ResolversTypes["SubscriptionStatus"]>,
    ParentType,
    ContextType
  >
  micropubSites?: Resolver<
    Array<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >
  allTweets?: Resolver<
    ResolversTypes["TweetConnection"],
    ParentType,
    ContextType,
    UserAllTweetsArgs
  >
}

export type UserSubscriptionResolvers<
  ContextType = CourierContext,
  ParentType = ResolversTypes["UserSubscription"]
> = {
  status?: Resolver<
    ResolversTypes["SubscriptionStatus"],
    ParentType,
    ContextType
  >
  periodEnd?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>
}

export type Resolvers<ContextType = CourierContext> = {
  AddDevicePayload?: AddDevicePayloadResolvers<ContextType>
  AddFeedPayload?: AddFeedPayloadResolvers<ContextType>
  CancelSubscriptionPayload?: CancelSubscriptionPayloadResolvers<ContextType>
  CancelTweetPayload?: CancelTweetPayloadResolvers<ContextType>
  CreditCard?: CreditCardResolvers<ContextType>
  Cursor?: GraphQLScalarType
  Customer?: CustomerResolvers<ContextType>
  DateTime?: GraphQLScalarType
  DeleteFeedPayload?: DeleteFeedPayloadResolvers<ContextType>
  DeviceToken?: DeviceTokenResolvers<ContextType>
  EditTweetPayload?: EditTweetPayloadResolvers<ContextType>
  Event?: EventResolvers<ContextType>
  EventConnection?: EventConnectionResolvers<ContextType>
  EventEdge?: EventEdgeResolvers<ContextType>
  Feed?: FeedResolvers<ContextType>
  FeedConnection?: FeedConnectionResolvers<ContextType>
  FeedEdge?: FeedEdgeResolvers<ContextType>
  MicroformatPage?: MicroformatPageResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  PageInfo?: PageInfoResolvers<ContextType>
  Post?: PostResolvers<ContextType>
  PostConnection?: PostConnectionResolvers<ContextType>
  PostEdge?: PostEdgeResolvers<ContextType>
  PostTweetPayload?: PostTweetPayloadResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  RefreshFeedPayload?: RefreshFeedPayloadResolvers<ContextType>
  SendTestNotificationPayload?: SendTestNotificationPayloadResolvers<
    ContextType
  >
  SetFeedOptionsPayload?: SetFeedOptionsPayloadResolvers<ContextType>
  SubscribedFeed?: SubscribedFeedResolvers<ContextType>
  SubscribedFeedConnection?: SubscribedFeedConnectionResolvers<ContextType>
  SubscribedFeedEdge?: SubscribedFeedEdgeResolvers<ContextType>
  SubscribePayload?: SubscribePayloadResolvers<ContextType>
  Tweet?: TweetResolvers<ContextType>
  TweetConnection?: TweetConnectionResolvers<ContextType>
  TweetEdge?: TweetEdgeResolvers<ContextType>
  UncancelTweetPayload?: UncancelTweetPayloadResolvers<ContextType>
  User?: UserResolvers<ContextType>
  UserSubscription?: UserSubscriptionResolvers<ContextType>
}

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = CourierContext> = Resolvers<ContextType>
