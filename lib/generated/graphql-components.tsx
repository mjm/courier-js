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
}

export type EditTweetPayload = {
  tweet: Tweet
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
}

export type PostTweetPayload = {
  tweet: Tweet
}

export type Query = {
  currentUser?: Maybe<User>
  allSubscribedFeeds: SubscribedFeedConnection
  allTweets: TweetConnection
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

export type RefreshFeedInput = {
  id: Scalars["ID"]
}

export type RefreshFeedPayload = {
  feed: Feed
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
  input: AddFeedInput
}

export type AddFeedMutation = { __typename?: "Mutation" } & {
  addFeed: { __typename?: "AddFeedPayload" } & {
    feed: { __typename?: "SubscribedFeed" } & AllFeedSubscriptionsFieldsFragment
  }
}

export type RefreshFeedMutationVariables = {
  input: RefreshFeedInput
}

export type RefreshFeedMutation = { __typename?: "Mutation" } & {
  refreshFeed: { __typename?: "RefreshFeedPayload" } & {
    feed: { __typename?: "Feed" } & Pick<
      Feed,
      "id" | "title" | "homePageURL" | "refreshedAt"
    >
  }
}

export type DeleteFeedMutationVariables = {
  input: DeleteFeedInput
}

export type DeleteFeedMutation = { __typename?: "Mutation" } & {
  deleteFeed: { __typename?: "DeleteFeedPayload" } & Pick<
    DeleteFeedPayload,
    "id"
  >
}

export type UpcomingTweetsQueryVariables = {
  cursor?: Maybe<Scalars["Cursor"]>
}

export type UpcomingTweetsQuery = { __typename?: "Query" } & {
  allTweets: { __typename?: "TweetConnection" } & TweetConnectionFieldsFragment
}

export type PastTweetsQueryVariables = {
  cursor?: Maybe<Scalars["Cursor"]>
}

export type PastTweetsQuery = { __typename?: "Query" } & {
  allTweets: { __typename?: "TweetConnection" } & TweetConnectionFieldsFragment
}

export type TweetConnectionFieldsFragment = {
  __typename?: "TweetConnection"
} & Pick<TweetConnection, "totalCount"> & {
    nodes: Array<{ __typename?: "Tweet" } & AllTweetsFieldsFragment>
    pageInfo: { __typename?: "PageInfo" } & Pick<
      PageInfo,
      "hasPreviousPage" | "endCursor"
    >
  }

export type AllTweetsFieldsFragment = { __typename?: "Tweet" } & Pick<
  Tweet,
  "id" | "body" | "mediaURLs" | "status" | "postedAt" | "postedTweetID"
> & {
    post: { __typename?: "Post" } & Pick<
      Post,
      "id" | "url" | "publishedAt" | "modifiedAt"
    >
  }

export type CancelTweetMutationVariables = {
  input: CancelTweetInput
}

export type CancelTweetMutation = { __typename?: "Mutation" } & {
  cancelTweet: { __typename?: "CancelTweetPayload" } & {
    tweet: { __typename?: "Tweet" } & Pick<Tweet, "id" | "status">
  }
}

export type UncancelTweetMutationVariables = {
  input: UncancelTweetInput
}

export type UncancelTweetMutation = { __typename?: "Mutation" } & {
  uncancelTweet: { __typename?: "UncancelTweetPayload" } & {
    tweet: { __typename?: "Tweet" } & Pick<Tweet, "id" | "status">
  }
}

export type PostTweetMutationVariables = {
  input: PostTweetInput
}

export type PostTweetMutation = { __typename?: "Mutation" } & {
  postTweet: { __typename?: "PostTweetPayload" } & {
    tweet: { __typename?: "Tweet" } & Pick<
      Tweet,
      "id" | "body" | "status" | "postedAt" | "postedTweetID"
    >
  }
}

export type EditTweetMutationVariables = {
  input: EditTweetInput
}

export type EditTweetMutation = { __typename?: "Mutation" } & {
  editTweet: { __typename?: "EditTweetPayload" } & {
    tweet: { __typename?: "Tweet" } & Pick<Tweet, "id" | "body">
  }
}

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
export const allTweetsFieldsFragmentDoc = gql`
  fragment allTweetsFields on Tweet {
    id
    post {
      id
      url
      publishedAt
      modifiedAt
    }
    body
    mediaURLs
    status
    postedAt
    postedTweetID
  }
`
export const tweetConnectionFieldsFragmentDoc = gql`
  fragment tweetConnectionFields on TweetConnection {
    nodes {
      ...allTweetsFields
    }
    pageInfo {
      hasPreviousPage
      endCursor
    }
    totalCount
  }
  ${allTweetsFieldsFragmentDoc}
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
  mutation AddFeed($input: AddFeedInput!) {
    addFeed(input: $input) {
      feed {
        ...allFeedSubscriptionsFields
      }
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
  mutation RefreshFeed($input: RefreshFeedInput!) {
    refreshFeed(input: $input) {
      feed {
        id
        title
        homePageURL
        refreshedAt
      }
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
  mutation DeleteFeed($input: DeleteFeedInput!) {
    deleteFeed(input: $input) {
      id
    }
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
export const UpcomingTweetsDocument = gql`
  query UpcomingTweets($cursor: Cursor) {
    allTweets(filter: UPCOMING, last: 10, before: $cursor)
      @connection(key: "upcomingTweets") {
      ...tweetConnectionFields
    }
  }
  ${tweetConnectionFieldsFragmentDoc}
`

export const UpcomingTweetsComponent = (
  props: Omit<
    Omit<
      ReactApollo.QueryProps<UpcomingTweetsQuery, UpcomingTweetsQueryVariables>,
      "query"
    >,
    "variables"
  > & { variables?: UpcomingTweetsQueryVariables }
) => (
  <ReactApollo.Query<UpcomingTweetsQuery, UpcomingTweetsQueryVariables>
    query={UpcomingTweetsDocument}
    {...props}
  />
)

export type UpcomingTweetsProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<UpcomingTweetsQuery, UpcomingTweetsQueryVariables>
> &
  TChildProps
export function withUpcomingTweets<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    UpcomingTweetsQuery,
    UpcomingTweetsQueryVariables,
    UpcomingTweetsProps<TChildProps>
  >
) {
  return ReactApollo.withQuery<
    TProps,
    UpcomingTweetsQuery,
    UpcomingTweetsQueryVariables,
    UpcomingTweetsProps<TChildProps>
  >(UpcomingTweetsDocument, {
    alias: "withUpcomingTweets",
    ...operationOptions,
  })
}
export const PastTweetsDocument = gql`
  query PastTweets($cursor: Cursor) {
    allTweets(filter: PAST, last: 10, before: $cursor)
      @connection(key: "pastTweets") {
      ...tweetConnectionFields
    }
  }
  ${tweetConnectionFieldsFragmentDoc}
`

export const PastTweetsComponent = (
  props: Omit<
    Omit<
      ReactApollo.QueryProps<PastTweetsQuery, PastTweetsQueryVariables>,
      "query"
    >,
    "variables"
  > & { variables?: PastTweetsQueryVariables }
) => (
  <ReactApollo.Query<PastTweetsQuery, PastTweetsQueryVariables>
    query={PastTweetsDocument}
    {...props}
  />
)

export type PastTweetsProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<PastTweetsQuery, PastTweetsQueryVariables>
> &
  TChildProps
export function withPastTweets<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    PastTweetsQuery,
    PastTweetsQueryVariables,
    PastTweetsProps<TChildProps>
  >
) {
  return ReactApollo.withQuery<
    TProps,
    PastTweetsQuery,
    PastTweetsQueryVariables,
    PastTweetsProps<TChildProps>
  >(PastTweetsDocument, {
    alias: "withPastTweets",
    ...operationOptions,
  })
}
export const CancelTweetDocument = gql`
  mutation CancelTweet($input: CancelTweetInput!) {
    cancelTweet(input: $input) {
      tweet {
        id
        status
      }
    }
  }
`
export type CancelTweetMutationFn = ReactApollo.MutationFn<
  CancelTweetMutation,
  CancelTweetMutationVariables
>

export const CancelTweetComponent = (
  props: Omit<
    Omit<
      ReactApollo.MutationProps<
        CancelTweetMutation,
        CancelTweetMutationVariables
      >,
      "mutation"
    >,
    "variables"
  > & { variables?: CancelTweetMutationVariables }
) => (
  <ReactApollo.Mutation<CancelTweetMutation, CancelTweetMutationVariables>
    mutation={CancelTweetDocument}
    {...props}
  />
)

export type CancelTweetProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<CancelTweetMutation, CancelTweetMutationVariables>
> &
  TChildProps
export function withCancelTweet<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    CancelTweetMutation,
    CancelTweetMutationVariables,
    CancelTweetProps<TChildProps>
  >
) {
  return ReactApollo.withMutation<
    TProps,
    CancelTweetMutation,
    CancelTweetMutationVariables,
    CancelTweetProps<TChildProps>
  >(CancelTweetDocument, {
    alias: "withCancelTweet",
    ...operationOptions,
  })
}
export const UncancelTweetDocument = gql`
  mutation UncancelTweet($input: UncancelTweetInput!) {
    uncancelTweet(input: $input) {
      tweet {
        id
        status
      }
    }
  }
`
export type UncancelTweetMutationFn = ReactApollo.MutationFn<
  UncancelTweetMutation,
  UncancelTweetMutationVariables
>

export const UncancelTweetComponent = (
  props: Omit<
    Omit<
      ReactApollo.MutationProps<
        UncancelTweetMutation,
        UncancelTweetMutationVariables
      >,
      "mutation"
    >,
    "variables"
  > & { variables?: UncancelTweetMutationVariables }
) => (
  <ReactApollo.Mutation<UncancelTweetMutation, UncancelTweetMutationVariables>
    mutation={UncancelTweetDocument}
    {...props}
  />
)

export type UncancelTweetProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<UncancelTweetMutation, UncancelTweetMutationVariables>
> &
  TChildProps
export function withUncancelTweet<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    UncancelTweetMutation,
    UncancelTweetMutationVariables,
    UncancelTweetProps<TChildProps>
  >
) {
  return ReactApollo.withMutation<
    TProps,
    UncancelTweetMutation,
    UncancelTweetMutationVariables,
    UncancelTweetProps<TChildProps>
  >(UncancelTweetDocument, {
    alias: "withUncancelTweet",
    ...operationOptions,
  })
}
export const PostTweetDocument = gql`
  mutation PostTweet($input: PostTweetInput!) {
    postTweet(input: $input) {
      tweet {
        id
        body
        status
        postedAt
        postedTweetID
      }
    }
  }
`
export type PostTweetMutationFn = ReactApollo.MutationFn<
  PostTweetMutation,
  PostTweetMutationVariables
>

export const PostTweetComponent = (
  props: Omit<
    Omit<
      ReactApollo.MutationProps<PostTweetMutation, PostTweetMutationVariables>,
      "mutation"
    >,
    "variables"
  > & { variables?: PostTweetMutationVariables }
) => (
  <ReactApollo.Mutation<PostTweetMutation, PostTweetMutationVariables>
    mutation={PostTweetDocument}
    {...props}
  />
)

export type PostTweetProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<PostTweetMutation, PostTweetMutationVariables>
> &
  TChildProps
export function withPostTweet<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    PostTweetMutation,
    PostTweetMutationVariables,
    PostTweetProps<TChildProps>
  >
) {
  return ReactApollo.withMutation<
    TProps,
    PostTweetMutation,
    PostTweetMutationVariables,
    PostTweetProps<TChildProps>
  >(PostTweetDocument, {
    alias: "withPostTweet",
    ...operationOptions,
  })
}
export const EditTweetDocument = gql`
  mutation EditTweet($input: EditTweetInput!) {
    editTweet(input: $input) {
      tweet {
        id
        body
      }
    }
  }
`
export type EditTweetMutationFn = ReactApollo.MutationFn<
  EditTweetMutation,
  EditTweetMutationVariables
>

export const EditTweetComponent = (
  props: Omit<
    Omit<
      ReactApollo.MutationProps<EditTweetMutation, EditTweetMutationVariables>,
      "mutation"
    >,
    "variables"
  > & { variables?: EditTweetMutationVariables }
) => (
  <ReactApollo.Mutation<EditTweetMutation, EditTweetMutationVariables>
    mutation={EditTweetDocument}
    {...props}
  />
)

export type EditTweetProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<EditTweetMutation, EditTweetMutationVariables>
> &
  TChildProps
export function withEditTweet<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    EditTweetMutation,
    EditTweetMutationVariables,
    EditTweetProps<TChildProps>
  >
) {
  return ReactApollo.withMutation<
    TProps,
    EditTweetMutation,
    EditTweetMutationVariables,
    EditTweetProps<TChildProps>
  >(EditTweetDocument, {
    alias: "withEditTweet",
    ...operationOptions,
  })
}
