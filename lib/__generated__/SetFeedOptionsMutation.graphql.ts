/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
export type SetFeedOptionsInput = {
    id: string;
    autopost?: boolean | null;
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
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input",
    "type": "SetFeedOptionsInput!"
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
    "concreteType": "SetFeedOptionsPayload",
    "kind": "LinkedField",
    "name": "setFeedOptions",
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
            "name": "autopost",
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
    "name": "SetFeedOptionsMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SetFeedOptionsMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "SetFeedOptionsMutation",
    "operationKind": "mutation",
    "text": "mutation SetFeedOptionsMutation(\n  $input: SetFeedOptionsInput!\n) {\n  setFeedOptions(input: $input) {\n    feed {\n      id\n      autopost\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = 'b45b8d657a4a537076c8d3ab870bce3a';
export default node;
