/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type TweetFilter = "PAST" | "UPCOMING" | "%future added value";
export type TweetListPaginationQueryVariables = {
    filter?: TweetFilter | null;
    count: number;
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
  $count: Int!
  $cursor: Cursor
) {
  viewer {
    ...TweetList_tweets_3KQYpM
  }
}

fragment EditTweetForm_tweet on Tweet {
  id
  body
  mediaURLs
}

fragment TweetCard_tweet on Tweet {
  status
  ...EditTweetForm_tweet
  ...ViewTweet_tweet
}

fragment TweetList_tweets_3KQYpM on User {
  allTweets(filter: $filter, last: $count, before: $cursor) {
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
      hasPreviousPage
      startCursor
    }
  }
}

fragment ViewTweet_tweet on Tweet {
  id
  body
  mediaURLs
  status
  action
  postAfter
  postedAt
  postedTweetID
  retweetID
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "filter",
    "type": "TweetFilter",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "count",
    "type": "Int!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "cursor",
    "type": "Cursor",
    "defaultValue": null
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
    "name": "before",
    "variableName": "cursor"
  },
  (v1/*: any*/),
  {
    "kind": "Variable",
    "name": "last",
    "variableName": "count"
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "TweetListPaginationQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "User",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "TweetList_tweets",
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
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "TweetListPaginationQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "User",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "allTweets",
            "storageKey": null,
            "args": (v2/*: any*/),
            "concreteType": "TweetConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "TweetEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Tweet",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "id",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "status",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "body",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "mediaURLs",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "action",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "postAfter",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "postedAt",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "postedTweetID",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "retweetID",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "__typename",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "cursor",
                    "args": null,
                    "storageKey": null
                  }
                ]
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "totalCount",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "pageInfo",
                "storageKey": null,
                "args": null,
                "concreteType": "PageInfo",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "hasPreviousPage",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "startCursor",
                    "args": null,
                    "storageKey": null
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedHandle",
            "alias": null,
            "name": "allTweets",
            "args": (v2/*: any*/),
            "handle": "connection",
            "key": "TweetList_allTweets",
            "filters": [
              "filter"
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "TweetListPaginationQuery",
    "id": null,
    "text": "query TweetListPaginationQuery(\n  $filter: TweetFilter\n  $count: Int!\n  $cursor: Cursor\n) {\n  viewer {\n    ...TweetList_tweets_3KQYpM\n  }\n}\n\nfragment EditTweetForm_tweet on Tweet {\n  id\n  body\n  mediaURLs\n}\n\nfragment TweetCard_tweet on Tweet {\n  status\n  ...EditTweetForm_tweet\n  ...ViewTweet_tweet\n}\n\nfragment TweetList_tweets_3KQYpM on User {\n  allTweets(filter: $filter, last: $count, before: $cursor) {\n    edges {\n      node {\n        id\n        ...TweetCard_tweet\n        __typename\n      }\n      cursor\n    }\n    totalCount\n    pageInfo {\n      hasPreviousPage\n      startCursor\n    }\n  }\n}\n\nfragment ViewTweet_tweet on Tweet {\n  id\n  body\n  mediaURLs\n  status\n  action\n  postAfter\n  postedAt\n  postedTweetID\n  retweetID\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '087fa8520791bb8771e3c61e53857f59';
export default node;
