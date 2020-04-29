/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
export type SubscriptionStatus = "ACTIVE" | "CANCELED" | "EXPIRED" | "INACTIVE" | "%future added value";
export type CancelSubscriptionInput = {
    placeholder?: string | null;
};
export type CancelSubscriptionMutationVariables = {
    input: CancelSubscriptionInput;
};
export type CancelSubscriptionMutationResponse = {
    readonly cancelSubscription: {
        readonly user: {
            readonly subscription: {
                readonly status: SubscriptionStatus;
            } | null;
        };
    };
};
export type CancelSubscriptionMutation = {
    readonly response: CancelSubscriptionMutationResponse;
    readonly variables: CancelSubscriptionMutationVariables;
};



/*
mutation CancelSubscriptionMutation(
  $input: CancelSubscriptionInput!
) {
  cancelSubscription(input: $input) {
    user {
      subscription {
        status
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
    "name": "input",
    "type": "CancelSubscriptionInput!"
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
    "concreteType": "CancelSubscriptionPayload",
    "kind": "LinkedField",
    "name": "cancelSubscription",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Viewer",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "UserSubscription",
            "kind": "LinkedField",
            "name": "subscription",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "status",
                "storageKey": null
              }
            ],
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
    "name": "CancelSubscriptionMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CancelSubscriptionMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "CancelSubscriptionMutation",
    "operationKind": "mutation",
    "text": "mutation CancelSubscriptionMutation(\n  $input: CancelSubscriptionInput!\n) {\n  cancelSubscription(input: $input) {\n    user {\n      subscription {\n        status\n      }\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = 'b73d5d705e03f00fa8fb64af0c790933';
export default node;
