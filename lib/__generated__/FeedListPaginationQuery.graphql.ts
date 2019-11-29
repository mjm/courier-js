/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FeedListPaginationQueryVariables = {
    count: number;
    cursor?: unknown | null;
};
export type FeedListPaginationQueryResponse = {
    readonly " $fragmentRefs": FragmentRefs<"FeedList_feeds">;
};
export type FeedListPaginationQuery = {
    readonly response: FeedListPaginationQueryResponse;
    readonly variables: FeedListPaginationQueryVariables;
};



/*
query FeedListPaginationQuery(
  $count: Int!
  $cursor: Cursor
) {
  ...FeedList_feeds_1G22uz
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

fragment FeedList_feeds_1G22uz on Query {
  allSubscribedFeeds(first: $count, after: $cursor) {
    edges {
      node {
        id
        ...FeedCard_feed
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
*/

const node: ConcreteRequest = (function(){
var v0 = [
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
v1 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  }
],
v2 = {
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
    "name": "FeedListPaginationQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "FragmentSpread",
        "name": "FeedList_feeds",
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
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "FeedListPaginationQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "allSubscribedFeeds",
        "storageKey": null,
        "args": (v1/*: any*/),
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
                  (v2/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "feed",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Feed",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
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
        "args": (v1/*: any*/),
        "handle": "connection",
        "key": "FeedList_allSubscribedFeeds",
        "filters": null
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "FeedListPaginationQuery",
    "id": null,
    "text": "query FeedListPaginationQuery(\n  $count: Int!\n  $cursor: Cursor\n) {\n  ...FeedList_feeds_1G22uz\n}\n\nfragment FeedCard_feed on SubscribedFeed {\n  id\n  feed {\n    id\n    url\n    title\n    homePageURL\n    micropubEndpoint\n    refreshedAt\n  }\n  autopost\n}\n\nfragment FeedList_feeds_1G22uz on Query {\n  allSubscribedFeeds(first: $count, after: $cursor) {\n    edges {\n      node {\n        id\n        ...FeedCard_feed\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '6f46cd920249ac37fe5a725c853b0c2e';
export default node;
