/* tslint:disable */
/* @relayHash 2d09ebaa74f1e3313668558a5892c8be */

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
  "kind": "InlineFragment",
  "type": "Feed",
  "selections": [
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
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "refreshing",
      "args": null,
      "storageKey": null
    }
  ]
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "FeedRefreshedEventQuery",
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
          (v3/*: any*/)
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "FeedRefreshedEventQuery",
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
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "__typename",
            "args": null,
            "storageKey": null
          },
          (v2/*: any*/),
          (v3/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "FeedRefreshedEventQuery",
    "id": null,
    "text": "query FeedRefreshedEventQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    id\n    ... on Feed {\n      title\n      homePageURL\n      micropubEndpoint\n      refreshedAt\n      refreshing\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'acc358829bdb8b515cbb7bed927290cc';
export default node;
