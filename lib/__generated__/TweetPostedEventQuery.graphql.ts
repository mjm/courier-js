/* tslint:disable */
/* @relayHash 5b89788093b94a67c0e8922266e0bbaf */

import { ConcreteRequest } from "relay-runtime";
export type TweetStatus = "CANCELED" | "DRAFT" | "POSTED" | "%future added value";
export type TweetPostedEventQueryVariables = {
    id: string;
};
export type TweetPostedEventQueryResponse = {
    readonly node: {
        readonly id: string;
        readonly tweets?: ReadonlyArray<{
            readonly body: string;
            readonly mediaURLs: ReadonlyArray<string>;
            readonly postedTweetID: string | null;
        }>;
        readonly status?: TweetStatus;
        readonly postedAt?: any | null;
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
    ... on TweetGroup {
      tweets {
        body
        mediaURLs
        postedTweetID
      }
      status
      postedAt
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
  "type": "TweetGroup",
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "tweets",
      "storageKey": null,
      "args": null,
      "concreteType": "Tweet",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "body",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "mediaURLs",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "postedTweetID",
          "args": null,
          "storageKey": null
        }
      ]
    },
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
    "text": "query TweetPostedEventQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    id\n    ... on TweetGroup {\n      tweets {\n        body\n        mediaURLs\n        postedTweetID\n      }\n      status\n      postedAt\n      postAfter\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '09a7f614c03401dd93a198281bc220a5';
export default node;
