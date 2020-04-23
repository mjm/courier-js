/* tslint:disable */
/* @relayHash cdafad0fbf713bc187343bc0a2fef14c */

import { ConcreteRequest } from "relay-runtime";
export type TweetStatus = "CANCELED" | "DRAFT" | "POSTED" | "%future added value";
export type TweetUncanceledEventQueryVariables = {
    id: string;
};
export type TweetUncanceledEventQueryResponse = {
    readonly node: {
        readonly id: string;
        readonly status?: TweetStatus;
    } | null;
};
export type TweetUncanceledEventQuery = {
    readonly response: TweetUncanceledEventQueryResponse;
    readonly variables: TweetUncanceledEventQueryVariables;
};



/*
query TweetUncanceledEventQuery(
  $id: ID!
) {
  node(id: $id) {
    __typename
    id
    ... on TweetGroup {
      status
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
  "type": "TweetGroup",
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "status",
      "args": null,
      "storageKey": null
    }
  ]
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "TweetUncanceledEventQuery",
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
    "name": "TweetUncanceledEventQuery",
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
    "name": "TweetUncanceledEventQuery",
    "id": null,
    "text": "query TweetUncanceledEventQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    id\n    ... on TweetGroup {\n      status\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '91b2a2973fcc8b61aa9511462b482005';
export default node;
