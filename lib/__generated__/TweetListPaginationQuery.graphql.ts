/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentReference, FragmentRefs } from "relay-runtime";
export type TweetFilter = "PAST" | "UPCOMING" | "%future added value";
export type TweetListPaginationQueryVariables = {
    filter?: TweetFilter | null;
    count?: number | null;
    cursor?: unknown | null;
};
export type TweetListPaginationQueryResponse = {
    readonly viewer: {
        readonly " $fragmentRefs": FragmentRefs<"TweetList_tweets">;
    } | null;
};
export type TweetListPaginationQuery = {
    readonly response: TweetListPaginationQueryResponse;
    readonly variables: TweetListPaginationQueryVariables;
};



/*
query TweetListPaginationQuery(
  $filter: TweetFilter
  $count: Int = 10
  $cursor: Cursor
) {
  viewer {
    ...TweetList_tweets_3KQYpM
  }
}

fragment EditTweetForm_tweet on TweetGroup {
  id
  tweets {
    body
    mediaURLs
  }
}

fragment TweetCard_tweet on TweetContent {
  ...EditTweetForm_tweet
  ...ViewTweetGroup_tweet
  ... on TweetGroup {
    status
  }
}

fragment TweetList_tweets_3KQYpM on Viewer {
  allTweets(filter: $filter, first: $count, after: $cursor) {
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
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "filter",
    "type": "TweetFilter"
  },
  {
    "defaultValue": 10,
    "kind": "LocalArgument",
    "name": "count",
    "type": "Int"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "cursor",
    "type": "Cursor"
  }
],
v1 = {
  "kind": "Variable",
  "name": "filter",
  "variableName": "filter"
},
v2 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  (v1/*: any*/),
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TweetListPaginationQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Viewer",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "args": [
              {
                "kind": "Variable",
                "name": "count",
                "variableName": "count"
              },
              {
                "kind": "Variable",
                "name": "cursor",
                "variableName": "cursor"
              },
              (v1/*: any*/)
            ],
            "kind": "FragmentSpread",
            "name": "TweetList_tweets"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TweetListPaginationQuery",
    "selections": [
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
            "args": (v2/*: any*/),
            "concreteType": "TweetGroupConnection",
            "kind": "LinkedField",
            "name": "allTweets",
            "plural": false,
            "selections": [
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
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "status",
                        "storageKey": null
                      },
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
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v2/*: any*/),
            "filters": [
              "filter"
            ],
            "handle": "connection",
            "key": "TweetList_allTweets",
            "kind": "LinkedHandle",
            "name": "allTweets"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": null,
    "metadata": {
      "derivedFrom": "TweetList_tweets",
      "isRefetchableQuery": true
    },
    "name": "TweetListPaginationQuery",
    "operationKind": "query",
    "text": "query TweetListPaginationQuery(\n  $filter: TweetFilter\n  $count: Int = 10\n  $cursor: Cursor\n) {\n  viewer {\n    ...TweetList_tweets_3KQYpM\n  }\n}\n\nfragment EditTweetForm_tweet on TweetGroup {\n  id\n  tweets {\n    body\n    mediaURLs\n  }\n}\n\nfragment TweetCard_tweet on TweetContent {\n  ...EditTweetForm_tweet\n  ...ViewTweetGroup_tweet\n  ... on TweetGroup {\n    status\n  }\n}\n\nfragment TweetList_tweets_3KQYpM on Viewer {\n  allTweets(filter: $filter, first: $count, after: $cursor) {\n    edges {\n      node {\n        id\n        ...TweetCard_tweet\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment ViewTweetGroup_tweet on TweetContent {\n  tweets {\n    ...ViewTweet_tweet\n    body\n    mediaURLs\n    postedTweetID\n  }\n  action\n  retweetID\n  ... on TweetGroup {\n    id\n    status\n    postAfter\n    postedAt\n    postedRetweetID\n  }\n}\n\nfragment ViewTweet_tweet on Tweet {\n  body\n  mediaURLs\n}\n"
  }
};
})();
(node as any).hash = '60742400a87cd6b674887784d2c3c17e';
export default node;
