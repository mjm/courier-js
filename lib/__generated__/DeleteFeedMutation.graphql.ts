/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type DeleteFeedInput = {
    readonly id: string;
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
    "kind": "LocalArgument",
    "name": "input",
    "type": "DeleteFeedInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "deleteFeed",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "DeleteFeedPayload",
    "plural": false,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "id",
        "args": null,
        "storageKey": null
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "DeleteFeedMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "DeleteFeedMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "DeleteFeedMutation",
    "id": null,
    "text": "mutation DeleteFeedMutation(\n  $input: DeleteFeedInput!\n) {\n  deleteFeed(input: $input) {\n    id\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '43eb71589c650a28ecd353b0f0207d8d';
export default node;
