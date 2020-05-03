/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type TweetsPageQueryVariables = {};
export type TweetsPageQueryResponse = {
    readonly upcoming: {
        readonly " $fragmentRefs": FragmentRefs<"TweetList_tweets">;
    } | null;
    readonly past: {
        readonly " $fragmentRefs": FragmentRefs<"TweetList_tweets">;
    } | null;
    readonly viewer: {
        readonly " $fragmentRefs": FragmentRefs<"SubscriptionProvider_user">;
    } | null;
};
export type TweetsPageQuery = {
    readonly response: TweetsPageQueryResponse;
    readonly variables: TweetsPageQueryVariables;
};



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

fragment EditTweetForm_tweet on TweetGroup {
  id
  tweets {
    body
    mediaURLs
  }
}

fragment SubscriptionProvider_user on Viewer {
  subscription {
    status
  }
  subscriptionStatusOverride
}

fragment TweetCard_tweet on TweetContent {
  ...EditTweetForm_tweet
  ...ViewTweetGroup_tweet
  ... on TweetGroup {
    status
  }
}

fragment TweetList_tweets_2ixgHQ on Viewer {
  allTweets(filter: PAST, first: 10) {
    edges {
      node {
        id
        ...TweetCard_tweet
        __typename
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}

fragment TweetList_tweets_30lx3F on Viewer {
  allTweets(filter: UPCOMING, first: 10) {
    edges {
      node {
        id
        ...TweetCard_tweet
        __typename
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}

fragment ViewTweetGroup_tweet on TweetContent {
  tweets {
    ...ViewTweet_tweet
    body
    mediaURLs
    postedTweetID
  }
  action
  retweetID
  ... on TweetGroup {
    id
    status
    postAfter
    postedAt
    postedRetweetID
  }
}

fragment ViewTweet_tweet on Tweet {
  body
  mediaURLs
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "kind": "Literal",
  "name": "filter",
  "value": "UPCOMING"
},
v1 = {
  "kind": "Literal",
  "name": "filter",
  "value": "PAST"
},
v2 = {
  "kind": "Literal",
  "name": "first",
  "value": 10
},
v3 = [
  (v0/*: any*/),
  (v2/*: any*/)
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v5 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "TweetGroupEdge",
    "kind": "LinkedField",
    "name": "edges",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "TweetGroup",
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Tweet",
            "kind": "LinkedField",
            "name": "tweets",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "body",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "mediaURLs",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "postedTweetID",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "action",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "retweetID",
            "storageKey": null
          },
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "postAfter",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "postedAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "postedRetweetID",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "cursor",
        "storageKey": null
      }
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "PageInfo",
    "kind": "LinkedField",
    "name": "pageInfo",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "endCursor",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "hasNextPage",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
],
v6 = [
  "filter"
],
v7 = [
  (v1/*: any*/),
  (v2/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "TweetsPageQuery",
    "selections": [
      {
        "alias": "upcoming",
        "args": null,
        "concreteType": "Viewer",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "args": [
              (v0/*: any*/)
            ],
            "kind": "FragmentSpread",
            "name": "TweetList_tweets"
          }
        ],
        "storageKey": null
      },
      {
        "alias": "past",
        "args": null,
        "concreteType": "Viewer",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "args": [
              (v1/*: any*/)
            ],
            "kind": "FragmentSpread",
            "name": "TweetList_tweets"
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Viewer",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "SubscriptionProvider_user"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "TweetsPageQuery",
    "selections": [
      {
        "alias": "upcoming",
        "args": null,
        "concreteType": "Viewer",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v3/*: any*/),
            "concreteType": "TweetGroupConnection",
            "kind": "LinkedField",
            "name": "allTweets",
            "plural": false,
            "selections": (v5/*: any*/),
            "storageKey": "allTweets(filter:\"UPCOMING\",first:10)"
          },
          {
            "alias": null,
            "args": (v3/*: any*/),
            "filters": (v6/*: any*/),
            "handle": "connection",
            "key": "TweetList_allTweets",
            "kind": "LinkedHandle",
            "name": "allTweets"
          }
        ],
        "storageKey": null
      },
      {
        "alias": "past",
        "args": null,
        "concreteType": "Viewer",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v7/*: any*/),
            "concreteType": "TweetGroupConnection",
            "kind": "LinkedField",
            "name": "allTweets",
            "plural": false,
            "selections": (v5/*: any*/),
            "storageKey": "allTweets(filter:\"PAST\",first:10)"
          },
          {
            "alias": null,
            "args": (v7/*: any*/),
            "filters": (v6/*: any*/),
            "handle": "connection",
            "key": "TweetList_allTweets",
            "kind": "LinkedHandle",
            "name": "allTweets"
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Viewer",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "UserSubscription",
            "kind": "LinkedField",
            "name": "subscription",
            "plural": false,
            "selections": [
              (v4/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "subscriptionStatusOverride",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "TweetsPageQuery",
    "operationKind": "query",
    "text": "query TweetsPageQuery {\n  upcoming: viewer {\n    ...TweetList_tweets_30lx3F\n  }\n  past: viewer {\n    ...TweetList_tweets_2ixgHQ\n  }\n  viewer {\n    ...SubscriptionProvider_user\n  }\n}\n\nfragment EditTweetForm_tweet on TweetGroup {\n  id\n  tweets {\n    body\n    mediaURLs\n  }\n}\n\nfragment SubscriptionProvider_user on Viewer {\n  subscription {\n    status\n  }\n  subscriptionStatusOverride\n}\n\nfragment TweetCard_tweet on TweetContent {\n  ...EditTweetForm_tweet\n  ...ViewTweetGroup_tweet\n  ... on TweetGroup {\n    status\n  }\n}\n\nfragment TweetList_tweets_2ixgHQ on Viewer {\n  allTweets(filter: PAST, first: 10) {\n    edges {\n      node {\n        id\n        ...TweetCard_tweet\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment TweetList_tweets_30lx3F on Viewer {\n  allTweets(filter: UPCOMING, first: 10) {\n    edges {\n      node {\n        id\n        ...TweetCard_tweet\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment ViewTweetGroup_tweet on TweetContent {\n  tweets {\n    ...ViewTweet_tweet\n    body\n    mediaURLs\n    postedTweetID\n  }\n  action\n  retweetID\n  ... on TweetGroup {\n    id\n    status\n    postAfter\n    postedAt\n    postedRetweetID\n  }\n}\n\nfragment ViewTweet_tweet on Tweet {\n  body\n  mediaURLs\n}\n"
  }
};
})();
(node as any).hash = '7957350955ebd9da59847129819fa00d';
export default node;
