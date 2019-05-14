export type Maybe<T> = T | null
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Cursor: any
  DateTime: any
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
  feed: Feed
}

export type QueryAllSubscribedFeedsArgs = {
  first?: Maybe<Scalars["Int"]>
  last?: Maybe<Scalars["Int"]>
  before?: Maybe<Scalars["Cursor"]>
  after?: Maybe<Scalars["Cursor"]>
}

export type QueryAllTweetsArgs = {
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
export type AllFeedsQueryVariables = {
  cursor?: Maybe<Scalars["Cursor"]>
}

export type AllFeedsQuery = { __typename?: "Query" } & {
  allSubscribedFeeds: { __typename?: "SubscribedFeedConnection" } & {
    nodes: Array<
      { __typename?: "SubscribedFeed" } & AllFeedSubscriptionsFieldsFragment
    >
    pageInfo: { __typename?: "PageInfo" } & Pick<
      PageInfo,
      "endCursor" | "hasNextPage"
    >
  }
}

export type AllFeedSubscriptionsFieldsFragment = {
  __typename?: "SubscribedFeed"
} & Pick<SubscribedFeed, "id" | "autopost"> & {
    feed: { __typename?: "Feed" } & Pick<
      Feed,
      "id" | "url" | "title" | "homePageURL" | "refreshedAt"
    >
  }

export type AddFeedMutationVariables = {
  feed: FeedInput
}

export type AddFeedMutation = { __typename?: "Mutation" } & {
  addFeed: {
    __typename?: "SubscribedFeed"
  } & AllFeedSubscriptionsFieldsFragment
}

export type RefreshFeedMutationVariables = {
  id: Scalars["ID"]
}

export type RefreshFeedMutation = { __typename?: "Mutation" } & {
  refreshFeed: { __typename?: "Feed" } & Pick<
    Feed,
    "id" | "title" | "homePageURL" | "refreshedAt"
  >
}

export type DeleteFeedMutationVariables = {
  id: Scalars["ID"]
}

export type DeleteFeedMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "deleteFeed"
>

import gql from "graphql-tag"
import * as React from "react"
import * as ReactApollo from "react-apollo"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export const allFeedSubscriptionsFieldsFragmentDoc = gql`
  fragment allFeedSubscriptionsFields on SubscribedFeed {
    id
    feed {
      id
      url
      title
      homePageURL
      refreshedAt
    }
    autopost
  }
`
export const AllFeedsDocument = gql`
  query AllFeeds($cursor: Cursor) {
    allSubscribedFeeds(first: 20, after: $cursor)
      @connection(key: "allSubscribedFeeds") {
      nodes {
        ...allFeedSubscriptionsFields
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
  ${allFeedSubscriptionsFieldsFragmentDoc}
`

export const AllFeedsComponent = (
  props: Omit<
    Omit<
      ReactApollo.QueryProps<AllFeedsQuery, AllFeedsQueryVariables>,
      "query"
    >,
    "variables"
  > & { variables?: AllFeedsQueryVariables }
) => (
  <ReactApollo.Query<AllFeedsQuery, AllFeedsQueryVariables>
    query={AllFeedsDocument}
    {...props}
  />
)

export type AllFeedsProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<AllFeedsQuery, AllFeedsQueryVariables>
> &
  TChildProps
export function withAllFeeds<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    AllFeedsQuery,
    AllFeedsQueryVariables,
    AllFeedsProps<TChildProps>
  >
) {
  return ReactApollo.withQuery<
    TProps,
    AllFeedsQuery,
    AllFeedsQueryVariables,
    AllFeedsProps<TChildProps>
  >(AllFeedsDocument, {
    alias: "withAllFeeds",
    ...operationOptions,
  })
}
export const AddFeedDocument = gql`
  mutation AddFeed($feed: FeedInput!) {
    addFeed(feed: $feed) {
      ...allFeedSubscriptionsFields
    }
  }
  ${allFeedSubscriptionsFieldsFragmentDoc}
`
export type AddFeedMutationFn = ReactApollo.MutationFn<
  AddFeedMutation,
  AddFeedMutationVariables
>

export const AddFeedComponent = (
  props: Omit<
    Omit<
      ReactApollo.MutationProps<AddFeedMutation, AddFeedMutationVariables>,
      "mutation"
    >,
    "variables"
  > & { variables?: AddFeedMutationVariables }
) => (
  <ReactApollo.Mutation<AddFeedMutation, AddFeedMutationVariables>
    mutation={AddFeedDocument}
    {...props}
  />
)

export type AddFeedProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<AddFeedMutation, AddFeedMutationVariables>
> &
  TChildProps
export function withAddFeed<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    AddFeedMutation,
    AddFeedMutationVariables,
    AddFeedProps<TChildProps>
  >
) {
  return ReactApollo.withMutation<
    TProps,
    AddFeedMutation,
    AddFeedMutationVariables,
    AddFeedProps<TChildProps>
  >(AddFeedDocument, {
    alias: "withAddFeed",
    ...operationOptions,
  })
}
export const RefreshFeedDocument = gql`
  mutation RefreshFeed($id: ID!) {
    refreshFeed(id: $id) {
      id
      title
      homePageURL
      refreshedAt
    }
  }
`
export type RefreshFeedMutationFn = ReactApollo.MutationFn<
  RefreshFeedMutation,
  RefreshFeedMutationVariables
>

export const RefreshFeedComponent = (
  props: Omit<
    Omit<
      ReactApollo.MutationProps<
        RefreshFeedMutation,
        RefreshFeedMutationVariables
      >,
      "mutation"
    >,
    "variables"
  > & { variables?: RefreshFeedMutationVariables }
) => (
  <ReactApollo.Mutation<RefreshFeedMutation, RefreshFeedMutationVariables>
    mutation={RefreshFeedDocument}
    {...props}
  />
)

export type RefreshFeedProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<RefreshFeedMutation, RefreshFeedMutationVariables>
> &
  TChildProps
export function withRefreshFeed<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    RefreshFeedMutation,
    RefreshFeedMutationVariables,
    RefreshFeedProps<TChildProps>
  >
) {
  return ReactApollo.withMutation<
    TProps,
    RefreshFeedMutation,
    RefreshFeedMutationVariables,
    RefreshFeedProps<TChildProps>
  >(RefreshFeedDocument, {
    alias: "withRefreshFeed",
    ...operationOptions,
  })
}
export const DeleteFeedDocument = gql`
  mutation DeleteFeed($id: ID!) {
    deleteFeed(id: $id)
  }
`
export type DeleteFeedMutationFn = ReactApollo.MutationFn<
  DeleteFeedMutation,
  DeleteFeedMutationVariables
>

export const DeleteFeedComponent = (
  props: Omit<
    Omit<
      ReactApollo.MutationProps<
        DeleteFeedMutation,
        DeleteFeedMutationVariables
      >,
      "mutation"
    >,
    "variables"
  > & { variables?: DeleteFeedMutationVariables }
) => (
  <ReactApollo.Mutation<DeleteFeedMutation, DeleteFeedMutationVariables>
    mutation={DeleteFeedDocument}
    {...props}
  />
)

export type DeleteFeedProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<DeleteFeedMutation, DeleteFeedMutationVariables>
> &
  TChildProps
export function withDeleteFeed<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    DeleteFeedMutation,
    DeleteFeedMutationVariables,
    DeleteFeedProps<TChildProps>
  >
) {
  return ReactApollo.withMutation<
    TProps,
    DeleteFeedMutation,
    DeleteFeedMutationVariables,
    DeleteFeedProps<TChildProps>
  >(DeleteFeedDocument, {
    alias: "withDeleteFeed",
    ...operationOptions,
  })
}
