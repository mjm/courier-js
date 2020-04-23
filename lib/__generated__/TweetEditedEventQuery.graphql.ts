/* tslint:disable */
/* @relayHash 878b6531c860149ab23ac9fed786a2e5 */

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
        }
      ]
    }
  ]
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "TweetEditedEventQuery",
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
    "name": "TweetEditedEventQuery",
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
    "name": "TweetEditedEventQuery",
    "id": null,
    "text": "query TweetEditedEventQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    id\n    ... on TweetGroup {\n      tweets {\n        body\n        mediaURLs\n      }\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '9862ebc06794392e94073c53aa518c24';
export default node;
