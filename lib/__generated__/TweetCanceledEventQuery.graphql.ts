/* tslint:disable */
/* @relayHash fd4eb0586964f588ac8b0e5931737880 */

import { ConcreteRequest } from "relay-runtime";
export type TweetStatus = "CANCELED" | "DRAFT" | "POSTED" | "%future added value";
export type TweetCanceledEventQueryVariables = {
    id: string;
};
export type TweetCanceledEventQueryResponse = {
    readonly node: {
        readonly id: string;
        readonly status?: TweetStatus;
    } | null;
};
export type TweetCanceledEventQuery = {
    readonly response: TweetCanceledEventQueryResponse;
    readonly variables: TweetCanceledEventQueryVariables;
};



/*
query TweetCanceledEventQuery(
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
    "name": "TweetCanceledEventQuery",
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
    "name": "TweetCanceledEventQuery",
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
    "name": "TweetCanceledEventQuery",
    "id": null,
    "text": "query TweetCanceledEventQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    id\n    ... on TweetGroup {\n      status\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'f3f80f8d0a3e68a053a749d820a8c1a9';
export default node;
