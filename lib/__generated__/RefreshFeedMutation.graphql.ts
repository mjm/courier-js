/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
export type RefreshFeedInput = {
    id: string;
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
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input",
    "type": "RefreshFeedInput!"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "RefreshFeedPayload",
    "kind": "LinkedField",
    "name": "refreshFeed",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Feed",
        "kind": "LinkedField",
        "name": "feed",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "title",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "homePageURL",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "refreshedAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "refreshing",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RefreshFeedMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RefreshFeedMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "RefreshFeedMutation",
    "operationKind": "mutation",
    "text": "mutation RefreshFeedMutation(\n  $input: RefreshFeedInput!\n) {\n  refreshFeed(input: $input) {\n    feed {\n      id\n      title\n      homePageURL\n      refreshedAt\n      refreshing\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = 'c87f78c7dcc8a3fb155695d062c215e9';
export default node;
