/* tslint:disable */
/* @relayHash a52f4398e47ca7b9384e438f55ac7ba9 */

import { ConcreteRequest } from "relay-runtime";
export type FeedOptionsChangedEventQueryVariables = {
    id: string;
};
export type FeedOptionsChangedEventQueryResponse = {
    readonly node: {
        readonly id: string;
        readonly autopost?: boolean;
    } | null;
};
export type FeedOptionsChangedEventQuery = {
    readonly response: FeedOptionsChangedEventQueryResponse;
    readonly variables: FeedOptionsChangedEventQueryVariables;
};



/*
query FeedOptionsChangedEventQuery(
  $id: ID!
) {
  node(id: $id) {
    __typename
    id
    ... on SubscribedFeed {
      autopost
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
  "type": "SubscribedFeed",
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "autopost",
      "args": null,
      "storageKey": null
    }
  ]
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "FeedOptionsChangedEventQuery",
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
    "name": "FeedOptionsChangedEventQuery",
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
    "name": "FeedOptionsChangedEventQuery",
    "id": null,
    "text": "query FeedOptionsChangedEventQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    id\n    ... on SubscribedFeed {\n      autopost\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '487240c0b67229c1816139af92ec4c51';
export default node;
