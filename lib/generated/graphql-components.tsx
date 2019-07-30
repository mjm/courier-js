export type Maybe<T> = T | null
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  DateTime: any
  Cursor: any
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
  customer?: Maybe<Customer>
  subscription?: Maybe<UserSubscription>
  subscriptionStatusOverride?: Maybe<SubscriptionStatus>
}

export type UserSubscription = {
  status: SubscriptionStatus
  periodEnd: Scalars["DateTime"]
}
export type CurrentUserQueryVariables = {}

export type CurrentUserQuery = { __typename?: "Query" } & {
  currentUser: Maybe<{ __typename?: "User" } & UserFieldsFragment>
}

export type UserFieldsFragment = { __typename?: "User" } & Pick<
  User,
  "name" | "nickname" | "picture" | "subscriptionStatusOverride"
> & {
    customer: Maybe<
      { __typename?: "Customer" } & {
        creditCard: Maybe<
          { __typename?: "CreditCard" } & Pick<
            CreditCard,
            "brand" | "lastFour" | "expirationMonth" | "expirationYear"
          >
        >
      }
    >
    subscription: Maybe<
      { __typename?: "UserSubscription" } & Pick<
        UserSubscription,
        "status" | "periodEnd"
      >
    >
  }

export type RecentEventsQueryVariables = {
  cursor?: Maybe<Scalars["Cursor"]>
}

export type RecentEventsQuery = { __typename?: "Query" } & {
  allEvents: { __typename?: "EventConnection" } & {
    nodes: Array<{ __typename?: "Event" } & EventFieldsFragment>
    pageInfo: { __typename?: "PageInfo" } & Pick<
      PageInfo,
      "endCursor" | "hasPreviousPage"
    >
  }
}

export type EventFieldsFragment = { __typename?: "Event" } & Pick<
  Event,
  "id" | "eventType" | "createdAt" | "boolValue"
> & {
    feed: Maybe<{ __typename?: "Feed" } & Pick<Feed, "id" | "title">>
    tweet: Maybe<{ __typename?: "Tweet" } & Pick<Tweet, "id" | "body">>
  }

export type CancelSubscriptionMutationVariables = {}

export type CancelSubscriptionMutation = { __typename?: "Mutation" } & {
  cancelSubscription: { __typename?: "CancelSubscriptionPayload" } & {
    user: { __typename?: "User" } & {
      subscription: Maybe<
        { __typename?: "UserSubscription" } & Pick<UserSubscription, "status">
      >
    }
  }
}

export type GetSubscriptionStatusQueryVariables = {}

export type GetSubscriptionStatusQuery = { __typename?: "Query" } & {
  currentUser: Maybe<
    { __typename?: "User" } & Pick<User, "subscriptionStatusOverride"> & {
        subscription: Maybe<
          { __typename?: "UserSubscription" } & Pick<UserSubscription, "status">
        >
      }
  >
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
      | "id"
      | "url"
      | "title"
      | "homePageURL"
      | "micropubEndpoint"
      | "refreshedAt"
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

export type SetFeedOptionsMutationVariables = {
  input: SetFeedOptionsInput
}

export type SetFeedOptionsMutation = { __typename?: "Mutation" } & {
  setFeedOptions: { __typename?: "SetFeedOptionsPayload" } & {
    feed: { __typename?: "SubscribedFeed" } & Pick<
      SubscribedFeed,
      "id" | "autopost"
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

export type GetFeedDetailsQueryVariables = {
  id: Scalars["ID"]
}

export type GetFeedDetailsQuery = { __typename?: "Query" } & {
  subscribedFeed: Maybe<
    { __typename?: "SubscribedFeed" } & {
      feed: { __typename?: "Feed" } & {
        posts: { __typename?: "PostConnection" } & {
          nodes: Array<
            { __typename?: "Post" } & Pick<
              Post,
              "id" | "url" | "title" | "htmlContent" | "publishedAt"
            >
          >
        }
      }
    } & AllFeedSubscriptionsFieldsFragment
  >
}

export type SubscribeMutationVariables = {
  input: SubscribeInput
}

export type SubscribeMutation = { __typename?: "Mutation" } & {
  subscribe: { __typename?: "SubscribePayload" } & {
    user: { __typename?: "User" } & SubscriptionInfoFragment
  }
}

export type SubscriptionInfoFragment = { __typename?: "User" } & {
  customer: Maybe<
    { __typename?: "Customer" } & {
      creditCard: Maybe<
        { __typename?: "CreditCard" } & Pick<
          CreditCard,
          "brand" | "lastFour" | "expirationMonth" | "expirationYear"
        >
      >
    }
  >
  subscription: Maybe<
    { __typename?: "UserSubscription" } & Pick<
      UserSubscription,
      "status" | "periodEnd"
    >
  >
}

export type SavedPaymentMethodQueryVariables = {}

export type SavedPaymentMethodQuery = { __typename?: "Query" } & {
  currentUser: Maybe<
    { __typename?: "User" } & {
      customer: Maybe<
        { __typename?: "Customer" } & {
          creditCard: Maybe<
            { __typename?: "CreditCard" } & Pick<
              CreditCard,
              "brand" | "lastFour" | "expirationMonth" | "expirationYear"
            >
          >
        }
      >
    }
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
  | "id"
  | "body"
  | "mediaURLs"
  | "status"
  | "postAfter"
  | "postedAt"
  | "postedTweetID"
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
      "id" | "body" | "mediaURLs" | "status" | "postedAt" | "postedTweetID"
    >
  }
}

export type EditTweetMutationVariables = {
  input: EditTweetInput
}

export type EditTweetMutation = { __typename?: "Mutation" } & {
  editTweet: { __typename?: "EditTweetPayload" } & {
    tweet: { __typename?: "Tweet" } & Pick<Tweet, "id" | "body" | "mediaURLs">
  }
}

import gql from "graphql-tag"
import * as React from "react"
import * as ReactApollo from "react-apollo"
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export const userFieldsFragmentDoc = gql`
  fragment userFields on User {
    name
    nickname
    picture
    customer {
      creditCard {
        brand
        lastFour
        expirationMonth
        expirationYear
      }
    }
    subscription {
      status
      periodEnd
    }
    subscriptionStatusOverride
  }
`
export const eventFieldsFragmentDoc = gql`
  fragment eventFields on Event {
    id
    eventType
    createdAt
    feed {
      id
      title
    }
    tweet {
      id
      body
    }
    boolValue
  }
`
export const allFeedSubscriptionsFieldsFragmentDoc = gql`
  fragment allFeedSubscriptionsFields on SubscribedFeed {
    id
    feed {
      id
      url
      title
      homePageURL
      micropubEndpoint
      refreshedAt
    }
    autopost
  }
`
export const subscriptionInfoFragmentDoc = gql`
  fragment subscriptionInfo on User {
    customer {
      creditCard {
        brand
        lastFour
        expirationMonth
        expirationYear
      }
    }
    subscription {
      status
      periodEnd
    }
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
    postAfter
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
export const CurrentUserDocument = gql`
  query CurrentUser {
    currentUser {
      ...userFields
    }
  }
  ${userFieldsFragmentDoc}
`

export const CurrentUserComponent = (
  props: Omit<
    Omit<
      ReactApollo.QueryProps<CurrentUserQuery, CurrentUserQueryVariables>,
      "query"
    >,
    "variables"
  > & { variables?: CurrentUserQueryVariables }
) => (
  <ReactApollo.Query<CurrentUserQuery, CurrentUserQueryVariables>
    query={CurrentUserDocument}
    {...props}
  />
)

export type CurrentUserProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<CurrentUserQuery, CurrentUserQueryVariables>
> &
  TChildProps
export function withCurrentUser<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    CurrentUserQuery,
    CurrentUserQueryVariables,
    CurrentUserProps<TChildProps>
  >
) {
  return ReactApollo.withQuery<
    TProps,
    CurrentUserQuery,
    CurrentUserQueryVariables,
    CurrentUserProps<TChildProps>
  >(CurrentUserDocument, {
    alias: "withCurrentUser",
    ...operationOptions,
  })
}
export const RecentEventsDocument = gql`
  query RecentEvents($cursor: Cursor) {
    allEvents(last: 15, before: $cursor) @connection(key: "events") {
      nodes {
        ...eventFields
      }
      pageInfo {
        endCursor
        hasPreviousPage
      }
    }
  }
  ${eventFieldsFragmentDoc}
`

export const RecentEventsComponent = (
  props: Omit<
    Omit<
      ReactApollo.QueryProps<RecentEventsQuery, RecentEventsQueryVariables>,
      "query"
    >,
    "variables"
  > & { variables?: RecentEventsQueryVariables }
) => (
  <ReactApollo.Query<RecentEventsQuery, RecentEventsQueryVariables>
    query={RecentEventsDocument}
    {...props}
  />
)

export type RecentEventsProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<RecentEventsQuery, RecentEventsQueryVariables>
> &
  TChildProps
export function withRecentEvents<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    RecentEventsQuery,
    RecentEventsQueryVariables,
    RecentEventsProps<TChildProps>
  >
) {
  return ReactApollo.withQuery<
    TProps,
    RecentEventsQuery,
    RecentEventsQueryVariables,
    RecentEventsProps<TChildProps>
  >(RecentEventsDocument, {
    alias: "withRecentEvents",
    ...operationOptions,
  })
}
export const CancelSubscriptionDocument = gql`
  mutation CancelSubscription {
    cancelSubscription(input: {}) {
      user {
        subscription {
          status
        }
      }
    }
  }
`
export type CancelSubscriptionMutationFn = ReactApollo.MutationFn<
  CancelSubscriptionMutation,
  CancelSubscriptionMutationVariables
>

export const CancelSubscriptionComponent = (
  props: Omit<
    Omit<
      ReactApollo.MutationProps<
        CancelSubscriptionMutation,
        CancelSubscriptionMutationVariables
      >,
      "mutation"
    >,
    "variables"
  > & { variables?: CancelSubscriptionMutationVariables }
) => (
  <ReactApollo.Mutation<
    CancelSubscriptionMutation,
    CancelSubscriptionMutationVariables
  >
    mutation={CancelSubscriptionDocument}
    {...props}
  />
)

export type CancelSubscriptionProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<
    CancelSubscriptionMutation,
    CancelSubscriptionMutationVariables
  >
> &
  TChildProps
export function withCancelSubscription<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    CancelSubscriptionMutation,
    CancelSubscriptionMutationVariables,
    CancelSubscriptionProps<TChildProps>
  >
) {
  return ReactApollo.withMutation<
    TProps,
    CancelSubscriptionMutation,
    CancelSubscriptionMutationVariables,
    CancelSubscriptionProps<TChildProps>
  >(CancelSubscriptionDocument, {
    alias: "withCancelSubscription",
    ...operationOptions,
  })
}
export const GetSubscriptionStatusDocument = gql`
  query GetSubscriptionStatus {
    currentUser {
      subscriptionStatusOverride
      subscription {
        status
      }
    }
  }
`

export const GetSubscriptionStatusComponent = (
  props: Omit<
    Omit<
      ReactApollo.QueryProps<
        GetSubscriptionStatusQuery,
        GetSubscriptionStatusQueryVariables
      >,
      "query"
    >,
    "variables"
  > & { variables?: GetSubscriptionStatusQueryVariables }
) => (
  <ReactApollo.Query<
    GetSubscriptionStatusQuery,
    GetSubscriptionStatusQueryVariables
  >
    query={GetSubscriptionStatusDocument}
    {...props}
  />
)

export type GetSubscriptionStatusProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<
    GetSubscriptionStatusQuery,
    GetSubscriptionStatusQueryVariables
  >
> &
  TChildProps
export function withGetSubscriptionStatus<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    GetSubscriptionStatusQuery,
    GetSubscriptionStatusQueryVariables,
    GetSubscriptionStatusProps<TChildProps>
  >
) {
  return ReactApollo.withQuery<
    TProps,
    GetSubscriptionStatusQuery,
    GetSubscriptionStatusQueryVariables,
    GetSubscriptionStatusProps<TChildProps>
  >(GetSubscriptionStatusDocument, {
    alias: "withGetSubscriptionStatus",
    ...operationOptions,
  })
}
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
export const SetFeedOptionsDocument = gql`
  mutation SetFeedOptions($input: SetFeedOptionsInput!) {
    setFeedOptions(input: $input) {
      feed {
        id
        autopost
      }
    }
  }
`
export type SetFeedOptionsMutationFn = ReactApollo.MutationFn<
  SetFeedOptionsMutation,
  SetFeedOptionsMutationVariables
>

export const SetFeedOptionsComponent = (
  props: Omit<
    Omit<
      ReactApollo.MutationProps<
        SetFeedOptionsMutation,
        SetFeedOptionsMutationVariables
      >,
      "mutation"
    >,
    "variables"
  > & { variables?: SetFeedOptionsMutationVariables }
) => (
  <ReactApollo.Mutation<SetFeedOptionsMutation, SetFeedOptionsMutationVariables>
    mutation={SetFeedOptionsDocument}
    {...props}
  />
)

export type SetFeedOptionsProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<
    SetFeedOptionsMutation,
    SetFeedOptionsMutationVariables
  >
> &
  TChildProps
export function withSetFeedOptions<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    SetFeedOptionsMutation,
    SetFeedOptionsMutationVariables,
    SetFeedOptionsProps<TChildProps>
  >
) {
  return ReactApollo.withMutation<
    TProps,
    SetFeedOptionsMutation,
    SetFeedOptionsMutationVariables,
    SetFeedOptionsProps<TChildProps>
  >(SetFeedOptionsDocument, {
    alias: "withSetFeedOptions",
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
export const GetFeedDetailsDocument = gql`
  query GetFeedDetails($id: ID!) {
    subscribedFeed(id: $id) {
      ...allFeedSubscriptionsFields
      feed {
        posts(last: 5) @connection(key: "posts") {
          nodes {
            id
            url
            title
            htmlContent
            publishedAt
          }
        }
      }
    }
  }
  ${allFeedSubscriptionsFieldsFragmentDoc}
`

export const GetFeedDetailsComponent = (
  props: Omit<
    Omit<
      ReactApollo.QueryProps<GetFeedDetailsQuery, GetFeedDetailsQueryVariables>,
      "query"
    >,
    "variables"
  > & { variables: GetFeedDetailsQueryVariables }
) => (
  <ReactApollo.Query<GetFeedDetailsQuery, GetFeedDetailsQueryVariables>
    query={GetFeedDetailsDocument}
    {...props}
  />
)

export type GetFeedDetailsProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<GetFeedDetailsQuery, GetFeedDetailsQueryVariables>
> &
  TChildProps
export function withGetFeedDetails<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    GetFeedDetailsQuery,
    GetFeedDetailsQueryVariables,
    GetFeedDetailsProps<TChildProps>
  >
) {
  return ReactApollo.withQuery<
    TProps,
    GetFeedDetailsQuery,
    GetFeedDetailsQueryVariables,
    GetFeedDetailsProps<TChildProps>
  >(GetFeedDetailsDocument, {
    alias: "withGetFeedDetails",
    ...operationOptions,
  })
}
export const SubscribeDocument = gql`
  mutation Subscribe($input: SubscribeInput!) {
    subscribe(input: $input) {
      user {
        ...subscriptionInfo
      }
    }
  }
  ${subscriptionInfoFragmentDoc}
`
export type SubscribeMutationFn = ReactApollo.MutationFn<
  SubscribeMutation,
  SubscribeMutationVariables
>

export const SubscribeComponent = (
  props: Omit<
    Omit<
      ReactApollo.MutationProps<SubscribeMutation, SubscribeMutationVariables>,
      "mutation"
    >,
    "variables"
  > & { variables?: SubscribeMutationVariables }
) => (
  <ReactApollo.Mutation<SubscribeMutation, SubscribeMutationVariables>
    mutation={SubscribeDocument}
    {...props}
  />
)

export type SubscribeProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<SubscribeMutation, SubscribeMutationVariables>
> &
  TChildProps
export function withSubscribe<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    SubscribeMutation,
    SubscribeMutationVariables,
    SubscribeProps<TChildProps>
  >
) {
  return ReactApollo.withMutation<
    TProps,
    SubscribeMutation,
    SubscribeMutationVariables,
    SubscribeProps<TChildProps>
  >(SubscribeDocument, {
    alias: "withSubscribe",
    ...operationOptions,
  })
}
export const SavedPaymentMethodDocument = gql`
  query SavedPaymentMethod {
    currentUser {
      customer {
        creditCard {
          brand
          lastFour
          expirationMonth
          expirationYear
        }
      }
    }
  }
`

export const SavedPaymentMethodComponent = (
  props: Omit<
    Omit<
      ReactApollo.QueryProps<
        SavedPaymentMethodQuery,
        SavedPaymentMethodQueryVariables
      >,
      "query"
    >,
    "variables"
  > & { variables?: SavedPaymentMethodQueryVariables }
) => (
  <ReactApollo.Query<SavedPaymentMethodQuery, SavedPaymentMethodQueryVariables>
    query={SavedPaymentMethodDocument}
    {...props}
  />
)

export type SavedPaymentMethodProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<
    SavedPaymentMethodQuery,
    SavedPaymentMethodQueryVariables
  >
> &
  TChildProps
export function withSavedPaymentMethod<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    SavedPaymentMethodQuery,
    SavedPaymentMethodQueryVariables,
    SavedPaymentMethodProps<TChildProps>
  >
) {
  return ReactApollo.withQuery<
    TProps,
    SavedPaymentMethodQuery,
    SavedPaymentMethodQueryVariables,
    SavedPaymentMethodProps<TChildProps>
  >(SavedPaymentMethodDocument, {
    alias: "withSavedPaymentMethod",
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
        mediaURLs
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
        mediaURLs
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
