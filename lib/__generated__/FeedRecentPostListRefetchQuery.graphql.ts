/* tslint:disable */
/* @relayHash 7b27ff58ef7494abce6ac53ca1ab626d */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FeedRecentPostListRefetchQueryVariables = {
    id: string;
};
export type FeedRecentPostListRefetchQueryResponse = {
    readonly node: {
        readonly id: string;
        readonly " $fragmentRefs": FragmentRefs<"FeedRecentPostList_feed">;
    } | null;
};
export type FeedRecentPostListRefetchQuery = {
    readonly response: FeedRecentPostListRefetchQueryResponse;
    readonly variables: FeedRecentPostListRefetchQueryVariables;
};



/*
query FeedRecentPostListRefetchQuery(
  $id: ID!
) {
  node(id: $id) {
    __typename
    id
    ...FeedRecentPostList_feed
  }
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
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v4 = [
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
    "name": "FeedRecentPostListRefetchQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "FragmentSpread",
            "name": "FeedRecentPostList_feed",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "FeedRecentPostListRefetchQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "type": "Feed",
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "posts",
                "storageKey": "posts(first:10)",
                "args": (v4/*: any*/),
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
                          (v3/*: any*/)
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
                "args": (v4/*: any*/),
                "handle": "connection",
                "key": "FeedRecentPostList_posts",
                "filters": null
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "FeedRecentPostListRefetchQuery",
    "id": null,
    "text": "query FeedRecentPostListRefetchQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    id\n    ...FeedRecentPostList_feed\n  }\n}\n\nfragment FeedRecentPostList_feed on Feed {\n  id\n  posts(first: 10) {\n    edges {\n      node {\n        id\n        url\n        title\n        htmlContent\n        publishedAt\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'adabcd4594d64211eb91d848f8c7725f';
export default node;
