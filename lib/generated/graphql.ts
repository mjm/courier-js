export type Maybe<T> = T | null
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type Feed = {
  id: Scalars["ID"]
  url: Scalars["String"]
  title: Scalars["String"]
  homePageURL: Scalars["String"]
}

export type FeedInput = {
  url: Scalars["String"]
}

export type Mutation = {
  addFeed: Feed
}

export type MutationAddFeedArgs = {
  feed: FeedInput
}

export type Query = {
  currentUser?: Maybe<User>
  allFeeds: Array<Feed>
  feed: Feed
}

export type QueryFeedArgs = {
  id: Scalars["ID"]
}

export type User = {
  name: Scalars["String"]
  nickname: Scalars["String"]
  picture: Scalars["String"]
}

import { GraphQLResolveInfo } from "graphql"

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
  Feed: Feed
  ID: Scalars["ID"]
  Mutation: {}
  FeedInput: FeedInput
  Boolean: Scalars["Boolean"]
}

export type FeedResolvers<
  ContextType = any,
  ParentType = ResolversTypes["Feed"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>
  url?: Resolver<ResolversTypes["String"], ParentType, ContextType>
  title?: Resolver<ResolversTypes["String"], ParentType, ContextType>
  homePageURL?: Resolver<ResolversTypes["String"], ParentType, ContextType>
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
}

export type QueryResolvers<
  ContextType = any,
  ParentType = ResolversTypes["Query"]
> = {
  currentUser?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>
  allFeeds?: Resolver<Array<ResolversTypes["Feed"]>, ParentType, ContextType>
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
  Feed?: FeedResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  User?: UserResolvers<ContextType>
}

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>
