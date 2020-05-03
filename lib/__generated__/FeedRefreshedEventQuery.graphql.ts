/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
export type FeedRefreshedEventQueryVariables = {
    id: string;
};
export type FeedRefreshedEventQueryResponse = {
    readonly node: {
        readonly id: string;
        readonly title?: string;
        readonly homePageURL?: string;
        readonly micropubEndpoint?: string;
        readonly refreshedAt?: any | null;
        readonly refreshing?: boolean;
    } | null;
};
export type FeedRefreshedEventQuery = {
    readonly response: FeedRefreshedEventQueryResponse;
    readonly variables: FeedRefreshedEventQueryVariables;
};



/*
query FeedRefreshedEventQuery(
  $id: ID!
) {
  node(id: $id) {
    __typename
    id
    ... on Feed {
      title
      homePageURL
      micropubEndpoint
      refreshedAt
      refreshing
    }
  }
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
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "title",
      "storageKey": null
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
    }
  ],
  "type": "Feed"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "FeedRefreshedEventQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/)
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
    "name": "FeedRefreshedEventQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          (v2/*: any*/),
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "FeedRefreshedEventQuery",
    "operationKind": "query",
    "text": "query FeedRefreshedEventQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    id\n    ... on Feed {\n      title\n      homePageURL\n      micropubEndpoint\n      refreshedAt\n      refreshing\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = 'acc358829bdb8b515cbb7bed927290cc';
export default node;
