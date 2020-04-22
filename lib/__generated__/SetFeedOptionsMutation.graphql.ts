/* tslint:disable */
/* @relayHash 322986402b4f0cf04942db3efea52d96 */

import { ConcreteRequest } from "relay-runtime";
export type SetFeedOptionsInput = {
    readonly id: string;
    readonly autopost?: boolean | null;
};
export type SetFeedOptionsMutationVariables = {
    input: SetFeedOptionsInput;
};
export type SetFeedOptionsMutationResponse = {
    readonly setFeedOptions: {
        readonly feed: {
            readonly id: string;
            readonly autopost: boolean;
        };
    };
};
export type SetFeedOptionsMutation = {
    readonly response: SetFeedOptionsMutationResponse;
    readonly variables: SetFeedOptionsMutationVariables;
};



/*
mutation SetFeedOptionsMutation(
  $input: SetFeedOptionsInput!
) {
  setFeedOptions(input: $input) {
    feed {
      id
      autopost
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "SetFeedOptionsInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "setFeedOptions",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "SetFeedOptionsPayload",
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
            "name": "autopost",
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
    "name": "SetFeedOptionsMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "SetFeedOptionsMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "SetFeedOptionsMutation",
    "id": null,
    "text": "mutation SetFeedOptionsMutation(\n  $input: SetFeedOptionsInput!\n) {\n  setFeedOptions(input: $input) {\n    feed {\n      id\n      autopost\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'b45b8d657a4a537076c8d3ab870bce3a';
export default node;
