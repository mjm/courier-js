/* tslint:disable */
/* @relayHash ad4c4d32f346eb7e83e54cf75c4bdedb */

import { ConcreteRequest } from "relay-runtime";
export type TweetStatus = "CANCELED" | "DRAFT" | "POSTED" | "%future added value";
export type TweetPostedEventQueryVariables = {
    id: string;
};
export type TweetPostedEventQueryResponse = {
    readonly node: {
        readonly id: string;
        readonly status?: TweetStatus;
        readonly postedAt?: any | null;
        readonly postedTweetID?: string | null;
        readonly postAfter?: any | null;
    } | null;
};
export type TweetPostedEventQuery = {
    readonly response: TweetPostedEventQueryResponse;
    readonly variables: TweetPostedEventQueryVariables;
};



/*
query TweetPostedEventQuery(
  $id: ID!
) {
  node(id: $id) {
    __typename
    id
    ... on Tweet {
      status
      postedAt
      postedTweetID
      postAfter
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
  "type": "Tweet",
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
      "name": "postedAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "postedTweetID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "postAfter",
      "args": null,
      "storageKey": null
    }
  ]
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "TweetPostedEventQuery",
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
    "name": "TweetPostedEventQuery",
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
    "name": "TweetPostedEventQuery",
    "id": null,
    "text": "query TweetPostedEventQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    id\n    ... on Tweet {\n      status\n      postedAt\n      postedTweetID\n      postAfter\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'b2ce407dd458a4e82505f9aa73792652';
export default node;
