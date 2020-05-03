/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AccountPageQueryVariables = {};
export type AccountPageQueryResponse = {
    readonly viewer: {
        readonly " $fragmentRefs": FragmentRefs<"UserInfoCard_user" | "SubscriptionInfoCard_user">;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"RecentEventsCard_events">;
};
export type AccountPageQuery = {
    readonly response: AccountPageQueryResponse;
    readonly variables: AccountPageQueryVariables;
};



/*
query AccountPageQuery {
  viewer {
    ...UserInfoCard_user
    ...SubscriptionInfoCard_user
  }
  ...RecentEventsCard_events
}

fragment EventTableRow_event on Event {
  id
  eventType
  createdAt
  feed {
    id
    title
  }
  tweetGroup {
    id
    tweets {
      body
    }
  }
  boolValue
}

fragment RecentEventsCard_events on Query {
  allEvents(first: 10) {
    edges {
      node {
        id
        ...EventTableRow_event
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

fragment SubscriptionInfoCard_user on Viewer {
  customer {
    creditCard {
      brand
      lastFour
    }
  }
  subscription {
    status
    periodEnd
  }
  subscriptionStatusOverride
}

fragment UserInfoCard_user on Viewer {
  name
  nickname
  picture
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AccountPageQuery",
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
            "args": null,
            "kind": "FragmentSpread",
            "name": "UserInfoCard_user"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "SubscriptionInfoCard_user"
          }
        ],
        "storageKey": null
      },
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "RecentEventsCard_events"
      }
    ],
    "type": "Query"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AccountPageQuery",
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
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "nickname",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "picture",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Customer",
            "kind": "LinkedField",
            "name": "customer",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "CreditCard",
                "kind": "LinkedField",
                "name": "creditCard",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "brand",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "lastFour",
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
            "args": null,
            "concreteType": "UserSubscription",
            "kind": "LinkedField",
            "name": "subscription",
            "plural": false,
            "selections": [
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
                "name": "periodEnd",
                "storageKey": null
              }
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
      },
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "EventConnection",
        "kind": "LinkedField",
        "name": "allEvents",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "EventEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Event",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "eventType",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "createdAt",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Feed",
                    "kind": "LinkedField",
                    "name": "feed",
                    "plural": false,
                    "selections": [
                      (v1/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "title",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "TweetGroup",
                    "kind": "LinkedField",
                    "name": "tweetGroup",
                    "plural": false,
                    "selections": [
                      (v1/*: any*/),
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
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "boolValue",
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
        "storageKey": "allEvents(first:10)"
      },
      {
        "alias": null,
        "args": (v0/*: any*/),
        "filters": null,
        "handle": "connection",
        "key": "RecentEventsCard_allEvents",
        "kind": "LinkedHandle",
        "name": "allEvents"
      }
    ]
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "AccountPageQuery",
    "operationKind": "query",
    "text": "query AccountPageQuery {\n  viewer {\n    ...UserInfoCard_user\n    ...SubscriptionInfoCard_user\n  }\n  ...RecentEventsCard_events\n}\n\nfragment EventTableRow_event on Event {\n  id\n  eventType\n  createdAt\n  feed {\n    id\n    title\n  }\n  tweetGroup {\n    id\n    tweets {\n      body\n    }\n  }\n  boolValue\n}\n\nfragment RecentEventsCard_events on Query {\n  allEvents(first: 10) {\n    edges {\n      node {\n        id\n        ...EventTableRow_event\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment SubscriptionInfoCard_user on Viewer {\n  customer {\n    creditCard {\n      brand\n      lastFour\n    }\n  }\n  subscription {\n    status\n    periodEnd\n  }\n  subscriptionStatusOverride\n}\n\nfragment UserInfoCard_user on Viewer {\n  name\n  nickname\n  picture\n}\n"
  }
};
})();
(node as any).hash = 'ae10ece807a28d9f69c00f289ef56791';
export default node;
