/* tslint:disable */
/* @relayHash febd2a3b0f43aea63d4d9968d0980866 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FeedDetailsPageQueryVariables = {
    id: string;
};
export type FeedDetailsPageQueryResponse = {
    readonly feed: {
        readonly " $fragmentRefs": FragmentRefs<"FeedDetails_feed">;
    } | null;
    readonly viewer: {
        readonly " $fragmentRefs": FragmentRefs<"FeedDetails_user">;
    } | null;
};
export type FeedDetailsPageQuery = {
    readonly response: FeedDetailsPageQueryResponse;
    readonly variables: FeedDetailsPageQueryVariables;
};



/*
query FeedDetailsPageQuery(
  $id: ID!
) {
  feed(id: $id) {
    ...FeedDetails_feed
    id
  }
  viewer {
    ...FeedDetails_user
  }
}

fragment FeedDetails_feed on Feed {
  id
  title
  url
  ...FeedRecentPostList_feed
  ...FeedInfoCard_feed
  ...FeedRemoveButton_feed
}

fragment FeedDetails_user on User {
  ...FeedInfoCard_user
}

fragment FeedInfoCard_feed on Feed {
  id
  url
  homePageURL
  micropubEndpoint
  refreshedAt
  autopost
}

fragment FeedInfoCard_user on User {
  micropubSites
}

fragment FeedRecentPostList_feed on Feed {
  id
  posts(first: 10) {
    edges {
      node {
        id
        url
        title
        htmlContent
        publishedAt
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

fragment FeedRemoveButton_feed on Feed {
  id
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "id",
    "type": "ID!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "title",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "url",
  "args": null,
  "storageKey": null
},
v5 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "FeedDetailsPageQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "feed",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Feed",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "FeedDetails_feed",
            "args": null
          }
        ]
      },
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
            "name": "FeedDetails_user",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "FeedDetailsPageQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "feed",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Feed",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "posts",
            "storageKey": "posts(first:10)",
            "args": (v5/*: any*/),
            "concreteType": "PostConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "PostEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Post",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      (v4/*: any*/),
                      (v3/*: any*/),
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "htmlContent",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "publishedAt",
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
            "name": "posts",
            "args": (v5/*: any*/),
            "handle": "connection",
            "key": "FeedRecentPostList_posts",
            "filters": null
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
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "autopost",
            "args": null,
            "storageKey": null
          }
        ]
      },
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
            "kind": "ScalarField",
            "alias": null,
            "name": "micropubSites",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "FeedDetailsPageQuery",
    "id": null,
    "text": "query FeedDetailsPageQuery(\n  $id: ID!\n) {\n  feed(id: $id) {\n    ...FeedDetails_feed\n    id\n  }\n  viewer {\n    ...FeedDetails_user\n  }\n}\n\nfragment FeedDetails_feed on Feed {\n  id\n  title\n  url\n  ...FeedRecentPostList_feed\n  ...FeedInfoCard_feed\n  ...FeedRemoveButton_feed\n}\n\nfragment FeedDetails_user on User {\n  ...FeedInfoCard_user\n}\n\nfragment FeedInfoCard_feed on Feed {\n  id\n  url\n  homePageURL\n  micropubEndpoint\n  refreshedAt\n  autopost\n}\n\nfragment FeedInfoCard_user on User {\n  micropubSites\n}\n\nfragment FeedRecentPostList_feed on Feed {\n  id\n  posts(first: 10) {\n    edges {\n      node {\n        id\n        url\n        title\n        htmlContent\n        publishedAt\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment FeedRemoveButton_feed on Feed {\n  id\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'f81486a1e109c1c16bfea0d8c777e9c2';
export default node;
