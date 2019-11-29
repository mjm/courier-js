/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type tweetsQueryVariables = {};
export type tweetsQueryResponse = {
    readonly upcoming: {
        readonly " $fragmentRefs": FragmentRefs<"TweetList_tweets">;
    } | null;
    readonly past: {
        readonly " $fragmentRefs": FragmentRefs<"TweetList_tweets">;
    } | null;
};
export type tweetsQuery = {
    readonly response: tweetsQueryResponse;
    readonly variables: tweetsQueryVariables;
};



/*
query tweetsQuery {
  upcoming: viewer {
    ...TweetList_tweets_30lx3F
  }
  past: viewer {
    ...TweetList_tweets_2ixgHQ
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

fragment TweetList_tweets_2ixgHQ on User {
  allTweets(filter: PAST, last: 10) {
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

fragment TweetList_tweets_30lx3F on User {
  allTweets(filter: UPCOMING, last: 10) {
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
  "name": "last",
  "value": 10
},
v3 = [
  (v0/*: any*/),
  (v2/*: any*/)
],
v4 = [
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
],
v5 = [
  "filter"
],
v6 = [
  (v1/*: any*/),
  (v2/*: any*/)
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "tweetsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "upcoming",
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
              (v0/*: any*/)
            ]
          }
        ]
      },
      {
        "kind": "LinkedField",
        "alias": "past",
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
              (v1/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "tweetsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "upcoming",
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
            "storageKey": "allTweets(filter:\"UPCOMING\",last:10)",
            "args": (v3/*: any*/),
            "concreteType": "TweetConnection",
            "plural": false,
            "selections": (v4/*: any*/)
          },
          {
            "kind": "LinkedHandle",
            "alias": null,
            "name": "allTweets",
            "args": (v3/*: any*/),
            "handle": "connection",
            "key": "TweetList_allTweets",
            "filters": (v5/*: any*/)
          }
        ]
      },
      {
        "kind": "LinkedField",
        "alias": "past",
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
            "storageKey": "allTweets(filter:\"PAST\",last:10)",
            "args": (v6/*: any*/),
            "concreteType": "TweetConnection",
            "plural": false,
            "selections": (v4/*: any*/)
          },
          {
            "kind": "LinkedHandle",
            "alias": null,
            "name": "allTweets",
            "args": (v6/*: any*/),
            "handle": "connection",
            "key": "TweetList_allTweets",
            "filters": (v5/*: any*/)
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "tweetsQuery",
    "id": null,
    "text": "query tweetsQuery {\n  upcoming: viewer {\n    ...TweetList_tweets_30lx3F\n  }\n  past: viewer {\n    ...TweetList_tweets_2ixgHQ\n  }\n}\n\nfragment EditTweetForm_tweet on Tweet {\n  id\n  body\n  mediaURLs\n}\n\nfragment TweetCard_tweet on Tweet {\n  status\n  ...EditTweetForm_tweet\n  ...ViewTweet_tweet\n}\n\nfragment TweetList_tweets_2ixgHQ on User {\n  allTweets(filter: PAST, last: 10) {\n    edges {\n      node {\n        id\n        ...TweetCard_tweet\n        __typename\n      }\n      cursor\n    }\n    totalCount\n    pageInfo {\n      hasPreviousPage\n      startCursor\n    }\n  }\n}\n\nfragment TweetList_tweets_30lx3F on User {\n  allTweets(filter: UPCOMING, last: 10) {\n    edges {\n      node {\n        id\n        ...TweetCard_tweet\n        __typename\n      }\n      cursor\n    }\n    totalCount\n    pageInfo {\n      hasPreviousPage\n      startCursor\n    }\n  }\n}\n\nfragment ViewTweet_tweet on Tweet {\n  id\n  body\n  mediaURLs\n  status\n  action\n  postAfter\n  postedAt\n  postedTweetID\n  retweetID\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '93e17a1df44248542dbd494eb0680034';
export default node;
