/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
export type DeleteFeedInput = {
    id: string;
};
export type DeleteFeedMutationVariables = {
    input: DeleteFeedInput;
};
export type DeleteFeedMutationResponse = {
    readonly deleteFeed: {
        readonly id: string;
    };
};
export type DeleteFeedMutation = {
    readonly response: DeleteFeedMutationResponse;
    readonly variables: DeleteFeedMutationVariables;
};



/*
mutation DeleteFeedMutation(
  $input: DeleteFeedInput!
) {
  deleteFeed(input: $input) {
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input",
    "type": "DeleteFeedInput!"
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
    "concreteType": "DeleteFeedPayload",
    "kind": "LinkedField",
    "name": "deleteFeed",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
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
    "name": "DeleteFeedMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "DeleteFeedMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "DeleteFeedMutation",
    "operationKind": "mutation",
    "text": "mutation DeleteFeedMutation(\n  $input: DeleteFeedInput!\n) {\n  deleteFeed(input: $input) {\n    id\n  }\n}\n"
  }
};
})();
(node as any).hash = '43eb71589c650a28ecd353b0f0207d8d';
export default node;
