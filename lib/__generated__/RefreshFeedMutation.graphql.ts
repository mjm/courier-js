/* tslint:disable */
/* @relayHash ed01e3f8b1176b936c2e57bde099ecf9 */

import { ConcreteRequest } from "relay-runtime";
export type RefreshFeedInput = {
    readonly id: string;
};
export type RefreshFeedMutationVariables = {
    input: RefreshFeedInput;
};
export type RefreshFeedMutationResponse = {
    readonly refreshFeed: {
        readonly feed: {
            readonly id: string;
            readonly title: string;
            readonly homePageURL: string;
            readonly refreshedAt: any | null;
            readonly refreshing: boolean;
        };
    };
};
export type RefreshFeedMutation = {
    readonly response: RefreshFeedMutationResponse;
    readonly variables: RefreshFeedMutationVariables;
};



/*
mutation RefreshFeedMutation(
  $input: RefreshFeedInput!
) {
  refreshFeed(input: $input) {
    feed {
      id
      title
      homePageURL
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
    "name": "input",
    "type": "RefreshFeedInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "refreshFeed",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "RefreshFeedPayload",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "feed",
        "storageKey": null,
        "args": null,
        "concreteType": "Feed",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
            "args": null,
            "storageKey": null
          },
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
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "RefreshFeedMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "RefreshFeedMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "RefreshFeedMutation",
    "id": null,
    "text": "mutation RefreshFeedMutation(\n  $input: RefreshFeedInput!\n) {\n  refreshFeed(input: $input) {\n    feed {\n      id\n      title\n      homePageURL\n      refreshedAt\n      refreshing\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'c87f78c7dcc8a3fb155695d062c215e9';
export default node;
