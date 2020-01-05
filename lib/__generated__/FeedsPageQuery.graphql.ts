/* tslint:disable */
/* @relayHash 95cc006ab5f1bc9bbbc4a5fa2a909239 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FeedsPageQueryVariables = {};
export type FeedsPageQueryResponse = {
    readonly " $fragmentRefs": FragmentRefs<"FeedList_feeds">;
};
export type FeedsPageQuery = {
    readonly response: FeedsPageQueryResponse;
    readonly variables: FeedsPageQueryVariables;
};



/*
query FeedsPageQuery {
  ...FeedList_feeds
}

fragment FeedCard_feed on SubscribedFeed {
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

fragment FeedList_feeds on Query {
  allSubscribedFeeds(first: 20) {
    edges {
      node {
        id
        ...FeedCard_feed
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
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 20
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "FeedsPageQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "FragmentSpread",
        "name": "FeedList_feeds",
        "args": null
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "FeedsPageQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "allSubscribedFeeds",
        "storageKey": "allSubscribedFeeds(first:20)",
        "args": (v0/*: any*/),
        "concreteType": "SubscribedFeedConnection",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "edges",
            "storageKey": null,
            "args": null,
            "concreteType": "SubscribedFeedEdge",
            "plural": true,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "node",
                "storageKey": null,
                "args": null,
                "concreteType": "SubscribedFeed",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "feed",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Feed",
                    "plural": false,
                    "selections": [
                      (v1/*: any*/),
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "url",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "title",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "homePageURL",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "micropubEndpoint",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "refreshedAt",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "autopost",
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
                "name": "endCursor",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "hasNextPage",
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
        "name": "allSubscribedFeeds",
        "args": (v0/*: any*/),
        "handle": "connection",
        "key": "FeedList_allSubscribedFeeds",
        "filters": null
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "FeedsPageQuery",
    "id": null,
    "text": "query FeedsPageQuery {\n  ...FeedList_feeds\n}\n\nfragment FeedCard_feed on SubscribedFeed {\n  id\n  feed {\n    id\n    url\n    title\n    homePageURL\n    micropubEndpoint\n    refreshedAt\n  }\n  autopost\n}\n\nfragment FeedList_feeds on Query {\n  allSubscribedFeeds(first: 20) {\n    edges {\n      node {\n        id\n        ...FeedCard_feed\n        __typename\n      }\n      cursor\n    }\n    totalCount\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '60a72d82d0844963e52425145f5988e0';
export default node;
