import gql from "graphql-tag"
import * as ApolloReactCommon from "@apollo/react-common"
import * as ApolloReactHooks from "@apollo/react-hooks"

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
  currentUser: Maybe<{ __typename?: "User" } & Pick<User, "micropubSites">>
}

export type GetEndpointsQueryVariables = {
  url: Scalars["String"]
}

export type GetEndpointsQuery = { __typename?: "Query" } & {
  microformats: Maybe<
    { __typename?: "MicroformatPage" } & Pick<
      MicroformatPage,
      "authorizationEndpoint" | "tokenEndpoint"
    >
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
  | "action"
  | "body"
  | "mediaURLs"
  | "retweetID"
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
export const UserFieldsFragmentDoc = gql`
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
export const EventFieldsFragmentDoc = gql`
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
export const AllFeedSubscriptionsFieldsFragmentDoc = gql`
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
export const SubscriptionInfoFragmentDoc = gql`
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
export const AllTweetsFieldsFragmentDoc = gql`
  fragment allTweetsFields on Tweet {
    id
    post {
      id
      url
      publishedAt
      modifiedAt
    }
    action
    body
    mediaURLs
    retweetID
    status
    postAfter
    postedAt
    postedTweetID
  }
`
export const TweetConnectionFieldsFragmentDoc = gql`
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
  ${AllTweetsFieldsFragmentDoc}
`
export const CurrentUserDocument = gql`
  query CurrentUser {
    currentUser {
      ...userFields
    }
  }
  ${UserFieldsFragmentDoc}
`

export function useCurrentUserQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    CurrentUserQuery,
    CurrentUserQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<CurrentUserQuery, CurrentUserQueryVariables>(
    CurrentUserDocument,
    baseOptions
  )
}
export type CurrentUserQueryHookResult = ReturnType<typeof useCurrentUserQuery>
export type CurrentUserQueryResult = ApolloReactCommon.QueryResult<
  CurrentUserQuery,
  CurrentUserQueryVariables
>
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
  ${EventFieldsFragmentDoc}
`

export function useRecentEventsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    RecentEventsQuery,
    RecentEventsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    RecentEventsQuery,
    RecentEventsQueryVariables
  >(RecentEventsDocument, baseOptions)
}
export type RecentEventsQueryHookResult = ReturnType<
  typeof useRecentEventsQuery
>
export type RecentEventsQueryResult = ApolloReactCommon.QueryResult<
  RecentEventsQuery,
  RecentEventsQueryVariables
>
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
export type CancelSubscriptionMutationFn = ApolloReactCommon.MutationFunction<
  CancelSubscriptionMutation,
  CancelSubscriptionMutationVariables
>

export function useCancelSubscriptionMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CancelSubscriptionMutation,
    CancelSubscriptionMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CancelSubscriptionMutation,
    CancelSubscriptionMutationVariables
  >(CancelSubscriptionDocument, baseOptions)
}
export type CancelSubscriptionMutationHookResult = ReturnType<
  typeof useCancelSubscriptionMutation
>
export type CancelSubscriptionMutationResult = ApolloReactCommon.MutationResult<
  CancelSubscriptionMutation
>
export type CancelSubscriptionMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CancelSubscriptionMutation,
  CancelSubscriptionMutationVariables
>
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

export function useGetSubscriptionStatusQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetSubscriptionStatusQuery,
    GetSubscriptionStatusQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetSubscriptionStatusQuery,
    GetSubscriptionStatusQueryVariables
  >(GetSubscriptionStatusDocument, baseOptions)
}
export type GetSubscriptionStatusQueryHookResult = ReturnType<
  typeof useGetSubscriptionStatusQuery
>
export type GetSubscriptionStatusQueryResult = ApolloReactCommon.QueryResult<
  GetSubscriptionStatusQuery,
  GetSubscriptionStatusQueryVariables
>
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
  ${AllFeedSubscriptionsFieldsFragmentDoc}
`

export function useAllFeedsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    AllFeedsQuery,
    AllFeedsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<AllFeedsQuery, AllFeedsQueryVariables>(
    AllFeedsDocument,
    baseOptions
  )
}
export type AllFeedsQueryHookResult = ReturnType<typeof useAllFeedsQuery>
export type AllFeedsQueryResult = ApolloReactCommon.QueryResult<
  AllFeedsQuery,
  AllFeedsQueryVariables
>
export const AddFeedDocument = gql`
  mutation AddFeed($input: AddFeedInput!) {
    addFeed(input: $input) {
      feed {
        ...allFeedSubscriptionsFields
      }
    }
  }
  ${AllFeedSubscriptionsFieldsFragmentDoc}
`
export type AddFeedMutationFn = ApolloReactCommon.MutationFunction<
  AddFeedMutation,
  AddFeedMutationVariables
>

export function useAddFeedMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    AddFeedMutation,
    AddFeedMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    AddFeedMutation,
    AddFeedMutationVariables
  >(AddFeedDocument, baseOptions)
}
export type AddFeedMutationHookResult = ReturnType<typeof useAddFeedMutation>
export type AddFeedMutationResult = ApolloReactCommon.MutationResult<
  AddFeedMutation
>
export type AddFeedMutationOptions = ApolloReactCommon.BaseMutationOptions<
  AddFeedMutation,
  AddFeedMutationVariables
>
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
export type RefreshFeedMutationFn = ApolloReactCommon.MutationFunction<
  RefreshFeedMutation,
  RefreshFeedMutationVariables
>

export function useRefreshFeedMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RefreshFeedMutation,
    RefreshFeedMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    RefreshFeedMutation,
    RefreshFeedMutationVariables
  >(RefreshFeedDocument, baseOptions)
}
export type RefreshFeedMutationHookResult = ReturnType<
  typeof useRefreshFeedMutation
>
export type RefreshFeedMutationResult = ApolloReactCommon.MutationResult<
  RefreshFeedMutation
>
export type RefreshFeedMutationOptions = ApolloReactCommon.BaseMutationOptions<
  RefreshFeedMutation,
  RefreshFeedMutationVariables
>
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
export type SetFeedOptionsMutationFn = ApolloReactCommon.MutationFunction<
  SetFeedOptionsMutation,
  SetFeedOptionsMutationVariables
>

export function useSetFeedOptionsMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    SetFeedOptionsMutation,
    SetFeedOptionsMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    SetFeedOptionsMutation,
    SetFeedOptionsMutationVariables
  >(SetFeedOptionsDocument, baseOptions)
}
export type SetFeedOptionsMutationHookResult = ReturnType<
  typeof useSetFeedOptionsMutation
>
export type SetFeedOptionsMutationResult = ApolloReactCommon.MutationResult<
  SetFeedOptionsMutation
>
export type SetFeedOptionsMutationOptions = ApolloReactCommon.BaseMutationOptions<
  SetFeedOptionsMutation,
  SetFeedOptionsMutationVariables
>
export const DeleteFeedDocument = gql`
  mutation DeleteFeed($input: DeleteFeedInput!) {
    deleteFeed(input: $input) {
      id
    }
  }
`
export type DeleteFeedMutationFn = ApolloReactCommon.MutationFunction<
  DeleteFeedMutation,
  DeleteFeedMutationVariables
>

export function useDeleteFeedMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    DeleteFeedMutation,
    DeleteFeedMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    DeleteFeedMutation,
    DeleteFeedMutationVariables
  >(DeleteFeedDocument, baseOptions)
}
export type DeleteFeedMutationHookResult = ReturnType<
  typeof useDeleteFeedMutation
>
export type DeleteFeedMutationResult = ApolloReactCommon.MutationResult<
  DeleteFeedMutation
>
export type DeleteFeedMutationOptions = ApolloReactCommon.BaseMutationOptions<
  DeleteFeedMutation,
  DeleteFeedMutationVariables
>
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
    currentUser {
      micropubSites
    }
  }
  ${AllFeedSubscriptionsFieldsFragmentDoc}
`

export function useGetFeedDetailsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetFeedDetailsQuery,
    GetFeedDetailsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetFeedDetailsQuery,
    GetFeedDetailsQueryVariables
  >(GetFeedDetailsDocument, baseOptions)
}
export type GetFeedDetailsQueryHookResult = ReturnType<
  typeof useGetFeedDetailsQuery
>
export type GetFeedDetailsQueryResult = ApolloReactCommon.QueryResult<
  GetFeedDetailsQuery,
  GetFeedDetailsQueryVariables
>
export const GetEndpointsDocument = gql`
  query GetEndpoints($url: String!) {
    microformats(url: $url) {
      authorizationEndpoint
      tokenEndpoint
    }
  }
`

export function useGetEndpointsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetEndpointsQuery,
    GetEndpointsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetEndpointsQuery,
    GetEndpointsQueryVariables
  >(GetEndpointsDocument, baseOptions)
}
export type GetEndpointsQueryHookResult = ReturnType<
  typeof useGetEndpointsQuery
>
export type GetEndpointsQueryResult = ApolloReactCommon.QueryResult<
  GetEndpointsQuery,
  GetEndpointsQueryVariables
>
export const SubscribeDocument = gql`
  mutation Subscribe($input: SubscribeInput!) {
    subscribe(input: $input) {
      user {
        ...subscriptionInfo
      }
    }
  }
  ${SubscriptionInfoFragmentDoc}
`
export type SubscribeMutationFn = ApolloReactCommon.MutationFunction<
  SubscribeMutation,
  SubscribeMutationVariables
>

export function useSubscribeMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    SubscribeMutation,
    SubscribeMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    SubscribeMutation,
    SubscribeMutationVariables
  >(SubscribeDocument, baseOptions)
}
export type SubscribeMutationHookResult = ReturnType<
  typeof useSubscribeMutation
>
export type SubscribeMutationResult = ApolloReactCommon.MutationResult<
  SubscribeMutation
>
export type SubscribeMutationOptions = ApolloReactCommon.BaseMutationOptions<
  SubscribeMutation,
  SubscribeMutationVariables
>
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

export function useSavedPaymentMethodQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    SavedPaymentMethodQuery,
    SavedPaymentMethodQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    SavedPaymentMethodQuery,
    SavedPaymentMethodQueryVariables
  >(SavedPaymentMethodDocument, baseOptions)
}
export type SavedPaymentMethodQueryHookResult = ReturnType<
  typeof useSavedPaymentMethodQuery
>
export type SavedPaymentMethodQueryResult = ApolloReactCommon.QueryResult<
  SavedPaymentMethodQuery,
  SavedPaymentMethodQueryVariables
>
export const UpcomingTweetsDocument = gql`
  query UpcomingTweets($cursor: Cursor) {
    allTweets(filter: UPCOMING, last: 10, before: $cursor)
      @connection(key: "upcomingTweets") {
      ...tweetConnectionFields
    }
  }
  ${TweetConnectionFieldsFragmentDoc}
`

export function useUpcomingTweetsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    UpcomingTweetsQuery,
    UpcomingTweetsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    UpcomingTweetsQuery,
    UpcomingTweetsQueryVariables
  >(UpcomingTweetsDocument, baseOptions)
}
export type UpcomingTweetsQueryHookResult = ReturnType<
  typeof useUpcomingTweetsQuery
>
export type UpcomingTweetsQueryResult = ApolloReactCommon.QueryResult<
  UpcomingTweetsQuery,
  UpcomingTweetsQueryVariables
>
export const PastTweetsDocument = gql`
  query PastTweets($cursor: Cursor) {
    allTweets(filter: PAST, last: 10, before: $cursor)
      @connection(key: "pastTweets") {
      ...tweetConnectionFields
    }
  }
  ${TweetConnectionFieldsFragmentDoc}
`

export function usePastTweetsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    PastTweetsQuery,
    PastTweetsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<PastTweetsQuery, PastTweetsQueryVariables>(
    PastTweetsDocument,
    baseOptions
  )
}
export type PastTweetsQueryHookResult = ReturnType<typeof usePastTweetsQuery>
export type PastTweetsQueryResult = ApolloReactCommon.QueryResult<
  PastTweetsQuery,
  PastTweetsQueryVariables
>
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
export type CancelTweetMutationFn = ApolloReactCommon.MutationFunction<
  CancelTweetMutation,
  CancelTweetMutationVariables
>

export function useCancelTweetMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CancelTweetMutation,
    CancelTweetMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CancelTweetMutation,
    CancelTweetMutationVariables
  >(CancelTweetDocument, baseOptions)
}
export type CancelTweetMutationHookResult = ReturnType<
  typeof useCancelTweetMutation
>
export type CancelTweetMutationResult = ApolloReactCommon.MutationResult<
  CancelTweetMutation
>
export type CancelTweetMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CancelTweetMutation,
  CancelTweetMutationVariables
>
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
export type UncancelTweetMutationFn = ApolloReactCommon.MutationFunction<
  UncancelTweetMutation,
  UncancelTweetMutationVariables
>

export function useUncancelTweetMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UncancelTweetMutation,
    UncancelTweetMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    UncancelTweetMutation,
    UncancelTweetMutationVariables
  >(UncancelTweetDocument, baseOptions)
}
export type UncancelTweetMutationHookResult = ReturnType<
  typeof useUncancelTweetMutation
>
export type UncancelTweetMutationResult = ApolloReactCommon.MutationResult<
  UncancelTweetMutation
>
export type UncancelTweetMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UncancelTweetMutation,
  UncancelTweetMutationVariables
>
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
export type PostTweetMutationFn = ApolloReactCommon.MutationFunction<
  PostTweetMutation,
  PostTweetMutationVariables
>

export function usePostTweetMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    PostTweetMutation,
    PostTweetMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    PostTweetMutation,
    PostTweetMutationVariables
  >(PostTweetDocument, baseOptions)
}
export type PostTweetMutationHookResult = ReturnType<
  typeof usePostTweetMutation
>
export type PostTweetMutationResult = ApolloReactCommon.MutationResult<
  PostTweetMutation
>
export type PostTweetMutationOptions = ApolloReactCommon.BaseMutationOptions<
  PostTweetMutation,
  PostTweetMutationVariables
>
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
export type EditTweetMutationFn = ApolloReactCommon.MutationFunction<
  EditTweetMutation,
  EditTweetMutationVariables
>

export function useEditTweetMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    EditTweetMutation,
    EditTweetMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    EditTweetMutation,
    EditTweetMutationVariables
  >(EditTweetDocument, baseOptions)
}
export type EditTweetMutationHookResult = ReturnType<
  typeof useEditTweetMutation
>
export type EditTweetMutationResult = ApolloReactCommon.MutationResult<
  EditTweetMutation
>
export type EditTweetMutationOptions = ApolloReactCommon.BaseMutationOptions<
  EditTweetMutation,
  EditTweetMutationVariables
>
