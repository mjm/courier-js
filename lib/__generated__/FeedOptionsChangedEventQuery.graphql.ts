/* tslint:disable */
/* eslint-disable */

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
    ... on Feed {
      autopost
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
      "name": "autopost",
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
    "name": "FeedOptionsChangedEventQuery",
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
    "name": "FeedOptionsChangedEventQuery",
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
    "name": "FeedOptionsChangedEventQuery",
    "operationKind": "query",
    "text": "query FeedOptionsChangedEventQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    id\n    ... on Feed {\n      autopost\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = 'edbca2dcce3f54439791530bef658eff';
export default node;
