/* tslint:disable */
/* @relayHash a4927d98b74119e8dc30d39292011d01 */

import { ConcreteRequest, FragmentRefs } from "relay-runtime"

export type TweetsPageQueryVariables = {}
export type TweetsPageQueryResponse = {
  readonly upcoming: {
    readonly " $fragmentRefs": FragmentRefs<"TweetList_tweets">
  } | null
  readonly past: {
    readonly " $fragmentRefs": FragmentRefs<"TweetList_tweets">
  } | null
  readonly viewer: {
    readonly " $fragmentRefs": FragmentRefs<"SubscriptionProvider_user">
  } | null
}
export type TweetsPageQuery = {
  readonly response: TweetsPageQueryResponse
  readonly variables: TweetsPageQueryVariables
}

/*
query TweetsPageQuery {
  upcoming: viewer {
    ...TweetList_tweets_30lx3F
  }
  past: viewer {
    ...TweetList_tweets_2ixgHQ
  }
  viewer {
    ...SubscriptionProvider_user
  }
}

fragment EditTweetForm_tweet on Tweet {
  id
  body
  mediaURLs
}

fragment SubscriptionProvider_user on User {
  subscription {
    status
  }
  subscriptionStatusOverride
}

fragment TweetCard_tweet on TweetContent {
  ...EditTweetForm_tweet
  ...ViewTweet_tweet
  ... on Tweet {
    status
  }
}

fragment TweetList_tweets_2ixgHQ on User {
  allTweets(filter: PAST, first: 10) {
    edges {
      node {
        id
        ...TweetCard_tweet
        __typename
      }
      cursor
    }
    totalCount
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}

fragment TweetList_tweets_30lx3F on User {
  allTweets(filter: UPCOMING, first: 10) {
    edges {
      node {
        id
        ...TweetCard_tweet
        __typename
      }
      cursor
    }
    totalCount
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}

fragment ViewTweet_tweet on TweetContent {
  body
  mediaURLs
  action
  retweetID
  ... on Tweet {
    id
    status
    postAfter
    postedAt
    postedTweetID
  }
}
*/

const node: ConcreteRequest = (function() {
  var v0 = {
      kind: "Literal",
      name: "filter",
      value: "UPCOMING",
    },
    v1 = {
      kind: "Literal",
      name: "filter",
      value: "PAST",
    },
    v2 = {
      kind: "Literal",
      name: "first",
      value: 10,
    },
    v3 = [v0 /*: any*/, v2 /*: any*/],
    v4 = {
      kind: "ScalarField",
      alias: null,
      name: "status",
      args: null,
      storageKey: null,
    },
    v5 = [
      {
        kind: "LinkedField",
        alias: null,
        name: "edges",
        storageKey: null,
        args: null,
        concreteType: "TweetEdge",
        plural: true,
        selections: [
          {
            kind: "LinkedField",
            alias: null,
            name: "node",
            storageKey: null,
            args: null,
            concreteType: "Tweet",
            plural: false,
            selections: [
              {
                kind: "ScalarField",
                alias: null,
                name: "id",
                args: null,
                storageKey: null,
              },
              {
                kind: "ScalarField",
                alias: null,
                name: "body",
                args: null,
                storageKey: null,
              },
              {
                kind: "ScalarField",
                alias: null,
                name: "mediaURLs",
                args: null,
                storageKey: null,
              },
              {
                kind: "ScalarField",
                alias: null,
                name: "action",
                args: null,
                storageKey: null,
              },
              {
                kind: "ScalarField",
                alias: null,
                name: "retweetID",
                args: null,
                storageKey: null,
              },
              v4 /*: any*/,
              {
                kind: "ScalarField",
                alias: null,
                name: "postAfter",
                args: null,
                storageKey: null,
              },
              {
                kind: "ScalarField",
                alias: null,
                name: "postedAt",
                args: null,
                storageKey: null,
              },
              {
                kind: "ScalarField",
                alias: null,
                name: "postedTweetID",
                args: null,
                storageKey: null,
              },
              {
                kind: "ScalarField",
                alias: null,
                name: "__typename",
                args: null,
                storageKey: null,
              },
            ],
          },
          {
            kind: "ScalarField",
            alias: null,
            name: "cursor",
            args: null,
            storageKey: null,
          },
        ],
      },
      {
        kind: "ScalarField",
        alias: null,
        name: "totalCount",
        args: null,
        storageKey: null,
      },
      {
        kind: "LinkedField",
        alias: null,
        name: "pageInfo",
        storageKey: null,
        args: null,
        concreteType: "PageInfo",
        plural: false,
        selections: [
          {
            kind: "ScalarField",
            alias: null,
            name: "endCursor",
            args: null,
            storageKey: null,
          },
          {
            kind: "ScalarField",
            alias: null,
            name: "hasNextPage",
            args: null,
            storageKey: null,
          },
        ],
      },
    ],
    v6 = ["filter"],
    v7 = [v1 /*: any*/, v2 /*: any*/]
  return {
    kind: "Request",
    fragment: {
      kind: "Fragment",
      name: "TweetsPageQuery",
      type: "Query",
      metadata: null,
      argumentDefinitions: [],
      selections: [
        {
          kind: "LinkedField",
          alias: "upcoming",
          name: "viewer",
          storageKey: null,
          args: null,
          concreteType: "User",
          plural: false,
          selections: [
            {
              kind: "FragmentSpread",
              name: "TweetList_tweets",
              args: [v0 /*: any*/],
            },
          ],
        },
        {
          kind: "LinkedField",
          alias: "past",
          name: "viewer",
          storageKey: null,
          args: null,
          concreteType: "User",
          plural: false,
          selections: [
            {
              kind: "FragmentSpread",
              name: "TweetList_tweets",
              args: [v1 /*: any*/],
            },
          ],
        },
        {
          kind: "LinkedField",
          alias: null,
          name: "viewer",
          storageKey: null,
          args: null,
          concreteType: "User",
          plural: false,
          selections: [
            {
              kind: "FragmentSpread",
              name: "SubscriptionProvider_user",
              args: null,
            },
          ],
        },
      ],
    },
    operation: {
      kind: "Operation",
      name: "TweetsPageQuery",
      argumentDefinitions: [],
      selections: [
        {
          kind: "LinkedField",
          alias: "upcoming",
          name: "viewer",
          storageKey: null,
          args: null,
          concreteType: "User",
          plural: false,
          selections: [
            {
              kind: "LinkedField",
              alias: null,
              name: "allTweets",
              storageKey: 'allTweets(filter:"UPCOMING",first:10)',
              args: v3 /*: any*/,
              concreteType: "TweetConnection",
              plural: false,
              selections: v5 /*: any*/,
            },
            {
              kind: "LinkedHandle",
              alias: null,
              name: "allTweets",
              args: v3 /*: any*/,
              handle: "connection",
              key: "TweetList_allTweets",
              filters: v6 /*: any*/,
            },
          ],
        },
        {
          kind: "LinkedField",
          alias: "past",
          name: "viewer",
          storageKey: null,
          args: null,
          concreteType: "User",
          plural: false,
          selections: [
            {
              kind: "LinkedField",
              alias: null,
              name: "allTweets",
              storageKey: 'allTweets(filter:"PAST",first:10)',
              args: v7 /*: any*/,
              concreteType: "TweetConnection",
              plural: false,
              selections: v5 /*: any*/,
            },
            {
              kind: "LinkedHandle",
              alias: null,
              name: "allTweets",
              args: v7 /*: any*/,
              handle: "connection",
              key: "TweetList_allTweets",
              filters: v6 /*: any*/,
            },
          ],
        },
        {
          kind: "LinkedField",
          alias: null,
          name: "viewer",
          storageKey: null,
          args: null,
          concreteType: "User",
          plural: false,
          selections: [
            {
              kind: "LinkedField",
              alias: null,
              name: "subscription",
              storageKey: null,
              args: null,
              concreteType: "UserSubscription",
              plural: false,
              selections: [v4 /*: any*/],
            },
            {
              kind: "ScalarField",
              alias: null,
              name: "subscriptionStatusOverride",
              args: null,
              storageKey: null,
            },
          ],
        },
      ],
    },
    params: {
      operationKind: "query",
      name: "TweetsPageQuery",
      id: null,
      text:
        "query TweetsPageQuery {\n  upcoming: viewer {\n    ...TweetList_tweets_30lx3F\n  }\n  past: viewer {\n    ...TweetList_tweets_2ixgHQ\n  }\n  viewer {\n    ...SubscriptionProvider_user\n  }\n}\n\nfragment EditTweetForm_tweet on Tweet {\n  id\n  body\n  mediaURLs\n}\n\nfragment SubscriptionProvider_user on User {\n  subscription {\n    status\n  }\n  subscriptionStatusOverride\n}\n\nfragment TweetCard_tweet on TweetContent {\n  ...EditTweetForm_tweet\n  ...ViewTweet_tweet\n  ... on Tweet {\n    status\n  }\n}\n\nfragment TweetList_tweets_2ixgHQ on User {\n  allTweets(filter: PAST, first: 10) {\n    edges {\n      node {\n        id\n        ...TweetCard_tweet\n        __typename\n      }\n      cursor\n    }\n    totalCount\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment TweetList_tweets_30lx3F on User {\n  allTweets(filter: UPCOMING, first: 10) {\n    edges {\n      node {\n        id\n        ...TweetCard_tweet\n        __typename\n      }\n      cursor\n    }\n    totalCount\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment ViewTweet_tweet on TweetContent {\n  body\n  mediaURLs\n  action\n  retweetID\n  ... on Tweet {\n    id\n    status\n    postAfter\n    postedAt\n    postedTweetID\n  }\n}\n",
      metadata: {},
    },
  }
})()
;(node as any).hash = "7957350955ebd9da59847129819fa00d"
export default node
