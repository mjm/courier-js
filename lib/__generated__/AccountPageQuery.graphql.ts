/* tslint:disable */
/* @relayHash bc4c97cefff3e37790fcfe01355a1b76 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AccountPageQueryVariables = {};
export type AccountPageQueryResponse = {
    readonly currentUser: {
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
  currentUser {
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
  tweet {
    id
    body
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

fragment SubscriptionInfoCard_user on User {
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

fragment UserInfoCard_user on User {
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
    "name": "AccountPageQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
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
            "name": "UserInfoCard_user",
            "args": null
          },
          {
            "kind": "FragmentSpread",
            "name": "SubscriptionInfoCard_user",
            "args": null
          }
        ]
      },
      {
        "kind": "FragmentSpread",
        "name": "RecentEventsCard_events",
        "args": null
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "AccountPageQuery",
    "argumentDefinitions": [],
    "selections": [
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
            "name": "name",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "nickname",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "picture",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "customer",
            "storageKey": null,
            "args": null,
            "concreteType": "Customer",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "creditCard",
                "storageKey": null,
                "args": null,
                "concreteType": "CreditCard",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "brand",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "lastFour",
                    "args": null,
                    "storageKey": null
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "subscription",
            "storageKey": null,
            "args": null,
            "concreteType": "UserSubscription",
            "plural": false,
            "selections": [
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
                "name": "periodEnd",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "subscriptionStatusOverride",
            "args": null,
            "storageKey": null
          }
        ]
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "allEvents",
        "storageKey": "allEvents(first:10)",
        "args": (v0/*: any*/),
        "concreteType": "EventConnection",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "edges",
            "storageKey": null,
            "args": null,
            "concreteType": "EventEdge",
            "plural": true,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "node",
                "storageKey": null,
                "args": null,
                "concreteType": "Event",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "eventType",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "createdAt",
                    "args": null,
                    "storageKey": null
                  },
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
                        "name": "title",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "tweet",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Tweet",
                    "plural": false,
                    "selections": [
                      (v1/*: any*/),
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "body",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "boolValue",
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
        "name": "allEvents",
        "args": (v0/*: any*/),
        "handle": "connection",
        "key": "RecentEventsCard_allEvents",
        "filters": null
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "AccountPageQuery",
    "id": null,
    "text": "query AccountPageQuery {\n  currentUser {\n    ...UserInfoCard_user\n    ...SubscriptionInfoCard_user\n  }\n  ...RecentEventsCard_events\n}\n\nfragment EventTableRow_event on Event {\n  id\n  eventType\n  createdAt\n  feed {\n    id\n    title\n  }\n  tweet {\n    id\n    body\n  }\n  boolValue\n}\n\nfragment RecentEventsCard_events on Query {\n  allEvents(first: 10) {\n    edges {\n      node {\n        id\n        ...EventTableRow_event\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment SubscriptionInfoCard_user on User {\n  customer {\n    creditCard {\n      brand\n      lastFour\n    }\n  }\n  subscription {\n    status\n    periodEnd\n  }\n  subscriptionStatusOverride\n}\n\nfragment UserInfoCard_user on User {\n  name\n  nickname\n  picture\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '0fd3d521a742f1e0209ec80183548ead';
export default node;
