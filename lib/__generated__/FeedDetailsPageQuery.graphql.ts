/* tslint:disable */
/* @relayHash fc606cd72b34156dbd1e88b15ba2cfdb */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FeedDetailsPageQueryVariables = {
    id: string;
};
export type FeedDetailsPageQueryResponse = {
    readonly subscribedFeed: {
        readonly " $fragmentRefs": FragmentRefs<"FeedDetails_feed">;
    } | null;
    readonly currentUser: {
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
  subscribedFeed(id: $id) {
    ...FeedDetails_feed
    id
  }
  currentUser {
    ...FeedDetails_user
  }
}

fragment FeedAutopostCard_feed on SubscribedFeed {
  id
  autopost
}

fragment FeedDetails_feed on SubscribedFeed {
  id
  feed {
    title
    url
    ...FeedRecentPostList_feed
    id
  }
  ...FeedInfoCard_feed
  ...FeedAutopostCard_feed
  ...FeedRemoveCard_feed
}

fragment FeedDetails_user on User {
  ...FeedInfoCard_user
}

fragment FeedInfoCard_feed on SubscribedFeed {
  feed {
    id
    url
    homePageURL
    micropubEndpoint
    refreshedAt
  }
  autopost
}

fragment FeedInfoCard_user on User {
  micropubSites
}

fragment FeedRecentPostList_feed on Feed {
  id
  refreshedAt
  posts(first: 5) {
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

fragment FeedRemoveCard_feed on SubscribedFeed {
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
    "value": 5
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
        "name": "subscribedFeed",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "SubscribedFeed",
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
        "name": "currentUser",
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
        "name": "subscribedFeed",
        "storageKey": null,
        "args": (v1/*: any*/),
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
              (v3/*: any*/),
              (v4/*: any*/),
              (v2/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "refreshedAt",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "posts",
                "storageKey": "posts(first:5)",
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
              }
            ]
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
        "name": "currentUser",
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
    "text": "query FeedDetailsPageQuery(\n  $id: ID!\n) {\n  subscribedFeed(id: $id) {\n    ...FeedDetails_feed\n    id\n  }\n  currentUser {\n    ...FeedDetails_user\n  }\n}\n\nfragment FeedAutopostCard_feed on SubscribedFeed {\n  id\n  autopost\n}\n\nfragment FeedDetails_feed on SubscribedFeed {\n  id\n  feed {\n    title\n    url\n    ...FeedRecentPostList_feed\n    id\n  }\n  ...FeedInfoCard_feed\n  ...FeedAutopostCard_feed\n  ...FeedRemoveCard_feed\n}\n\nfragment FeedDetails_user on User {\n  ...FeedInfoCard_user\n}\n\nfragment FeedInfoCard_feed on SubscribedFeed {\n  feed {\n    id\n    url\n    homePageURL\n    micropubEndpoint\n    refreshedAt\n  }\n  autopost\n}\n\nfragment FeedInfoCard_user on User {\n  micropubSites\n}\n\nfragment FeedRecentPostList_feed on Feed {\n  id\n  refreshedAt\n  posts(first: 5) {\n    edges {\n      node {\n        id\n        url\n        title\n        htmlContent\n        publishedAt\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment FeedRemoveCard_feed on SubscribedFeed {\n  id\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'd2c7cfdbc7c42336af9b6852ce05f070';
export default node;
