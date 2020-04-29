/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
export type TweetEditedEventQueryVariables = {
    id: string;
};
export type TweetEditedEventQueryResponse = {
    readonly node: {
        readonly id: string;
        readonly tweets?: ReadonlyArray<{
            readonly body: string;
            readonly mediaURLs: ReadonlyArray<string>;
        }>;
    } | null;
};
export type TweetEditedEventQuery = {
    readonly response: TweetEditedEventQueryResponse;
    readonly variables: TweetEditedEventQueryVariables;
};



/*
query TweetEditedEventQuery(
  $id: ID!
) {
  node(id: $id) {
    __typename
    id
    ... on TweetGroup {
      tweets {
        body
        mediaURLs
      }
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
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "mediaURLs",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "TweetGroup"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TweetEditedEventQuery",
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
    "name": "TweetEditedEventQuery",
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
    "name": "TweetEditedEventQuery",
    "operationKind": "query",
    "text": "query TweetEditedEventQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    id\n    ... on TweetGroup {\n      tweets {\n        body\n        mediaURLs\n      }\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '9862ebc06794392e94073c53aa518c24';
export default node;
