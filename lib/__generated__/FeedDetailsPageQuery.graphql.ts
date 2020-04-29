/* tslint:disable */
/* eslint-disable */

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

fragment FeedDetails_user on Viewer {
  ...FeedInfoCard_user
}

fragment FeedInfoCard_feed on Feed {
  id
  url
  homePageURL
  micropubEndpoint
  refreshedAt
  refreshing
  autopost
}

fragment FeedInfoCard_user on Viewer {
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
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id",
    "type": "ID!"
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
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
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "FeedDetailsPageQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Feed",
        "kind": "LinkedField",
        "name": "feed",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "FeedDetails_feed"
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
            "name": "FeedDetails_user"
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
    "name": "FeedDetailsPageQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Feed",
        "kind": "LinkedField",
        "name": "feed",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "alias": null,
            "args": (v5/*: any*/),
            "concreteType": "PostConnection",
            "kind": "LinkedField",
            "name": "posts",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "PostEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Post",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      (v4/*: any*/),
                      (v3/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "htmlContent",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "publishedAt",
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
            "storageKey": "posts(first:10)"
          },
          {
            "alias": null,
            "args": (v5/*: any*/),
            "filters": null,
            "handle": "connection",
            "key": "FeedRecentPostList_posts",
            "kind": "LinkedHandle",
            "name": "posts"
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "homePageURL",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "micropubEndpoint",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "refreshedAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "refreshing",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "autopost",
            "storageKey": null
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
            "kind": "ScalarField",
            "name": "micropubSites",
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
    "name": "FeedDetailsPageQuery",
    "operationKind": "query",
    "text": "query FeedDetailsPageQuery(\n  $id: ID!\n) {\n  feed(id: $id) {\n    ...FeedDetails_feed\n    id\n  }\n  viewer {\n    ...FeedDetails_user\n  }\n}\n\nfragment FeedDetails_feed on Feed {\n  id\n  title\n  url\n  ...FeedRecentPostList_feed\n  ...FeedInfoCard_feed\n  ...FeedRemoveButton_feed\n}\n\nfragment FeedDetails_user on Viewer {\n  ...FeedInfoCard_user\n}\n\nfragment FeedInfoCard_feed on Feed {\n  id\n  url\n  homePageURL\n  micropubEndpoint\n  refreshedAt\n  refreshing\n  autopost\n}\n\nfragment FeedInfoCard_user on Viewer {\n  micropubSites\n}\n\nfragment FeedRecentPostList_feed on Feed {\n  id\n  posts(first: 10) {\n    edges {\n      node {\n        id\n        url\n        title\n        htmlContent\n        publishedAt\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment FeedRemoveButton_feed on Feed {\n  id\n}\n"
  }
};
})();
(node as any).hash = 'f81486a1e109c1c16bfea0d8c777e9c2';
export default node;
