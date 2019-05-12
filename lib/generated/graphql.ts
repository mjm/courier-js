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
  before?: Maybe<Scalars["String"]>
  after?: Maybe<Scalars["String"]>
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
  addFeed: Feed
  refreshFeed: Feed
  deleteFeed: Scalars["ID"]
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

export type PageInfo = {
  startCursor?: Maybe<Scalars["Cursor"]>
  endCursor?: Maybe<Scalars["Cursor"]>
  hasNextPage: Scalars["Boolean"]
  hasPreviousPage: Scalars["Boolean"]
}

export type Post = {
  id: Scalars["ID"]
  feed?: Maybe<Feed>
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
  allFeeds: FeedConnection
  feed: Feed
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

export type User = {
  name: Scalars["String"]
  nickname: Scalars["String"]
  picture: Scalars["String"]
}
import { DBFeed, FeedPager, DBPost, PostPager } from "../data/types"

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
  FeedConnection: FeedPager
  FeedEdge: Omit<FeedEdge, "node"> & { node: ResolversTypes["Feed"] }
  Feed: DBFeed
  ID: Scalars["ID"]
  DateTime: Scalars["DateTime"]
  PostConnection: PostPager
  PostEdge: Omit<PostEdge, "node"> & { node: ResolversTypes["Post"] }
  Post: DBPost
  PageInfo: PageInfo
  Boolean: Scalars["Boolean"]
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
  ContextType = any,
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
  ContextType = any,
  ParentType = ResolversTypes["FeedConnection"]
> = {
  edges?: Resolver<Array<ResolversTypes["FeedEdge"]>, ParentType, ContextType>
  nodes?: Resolver<Array<ResolversTypes["Feed"]>, ParentType, ContextType>
  pageInfo?: Resolver<ResolversTypes["PageInfo"], ParentType, ContextType>
  totalCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>
}

export type FeedEdgeResolvers<
  ContextType = any,
  ParentType = ResolversTypes["FeedEdge"]
> = {
  cursor?: Resolver<ResolversTypes["Cursor"], ParentType, ContextType>
  node?: Resolver<ResolversTypes["Feed"], ParentType, ContextType>
}

export type MutationResolvers<
  ContextType = any,
  ParentType = ResolversTypes["Mutation"]
> = {
  addFeed?: Resolver<
    ResolversTypes["Feed"],
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
}

export type PageInfoResolvers<
  ContextType = any,
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
  ContextType = any,
  ParentType = ResolversTypes["Post"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>
  feed?: Resolver<Maybe<ResolversTypes["Feed"]>, ParentType, ContextType>
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
  ContextType = any,
  ParentType = ResolversTypes["PostConnection"]
> = {
  edges?: Resolver<Array<ResolversTypes["PostEdge"]>, ParentType, ContextType>
  nodes?: Resolver<Array<ResolversTypes["Post"]>, ParentType, ContextType>
  pageInfo?: Resolver<ResolversTypes["PageInfo"], ParentType, ContextType>
  totalCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>
}

export type PostEdgeResolvers<
  ContextType = any,
  ParentType = ResolversTypes["PostEdge"]
> = {
  cursor?: Resolver<ResolversTypes["Cursor"], ParentType, ContextType>
  node?: Resolver<ResolversTypes["Post"], ParentType, ContextType>
}

export type QueryResolvers<
  ContextType = any,
  ParentType = ResolversTypes["Query"]
> = {
  currentUser?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>
  allFeeds?: Resolver<
    ResolversTypes["FeedConnection"],
    ParentType,
    ContextType,
    QueryAllFeedsArgs
  >
  feed?: Resolver<
    ResolversTypes["Feed"],
    ParentType,
    ContextType,
    QueryFeedArgs
  >
}

export type UserResolvers<
  ContextType = any,
  ParentType = ResolversTypes["User"]
> = {
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>
  nickname?: Resolver<ResolversTypes["String"], ParentType, ContextType>
  picture?: Resolver<ResolversTypes["String"], ParentType, ContextType>
}

export type Resolvers<ContextType = any> = {
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
  User?: UserResolvers<ContextType>
}

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>
