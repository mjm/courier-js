/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type SubscriptionStatus = "ACTIVE" | "CANCELED" | "EXPIRED" | "INACTIVE" | "%future added value";
export type CancelSubscriptionInput = {
    readonly placeholder?: string | null;
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
    "kind": "LocalArgument",
    "name": "input",
    "type": "CancelSubscriptionInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "cancelSubscription",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "CancelSubscriptionPayload",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "user",
        "storageKey": null,
        "args": null,
        "concreteType": "User",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "subscription",
            "storageKey": null,
            "args": null,
            "concreteType": "UserSubscription",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "status",
                "args": null,
                "storageKey": null
              }
            ]
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
    "name": "CancelSubscriptionMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "CancelSubscriptionMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "CancelSubscriptionMutation",
    "id": null,
    "text": "mutation CancelSubscriptionMutation(\n  $input: CancelSubscriptionInput!\n) {\n  cancelSubscription(input: $input) {\n    user {\n      subscription {\n        status\n      }\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'b73d5d705e03f00fa8fb64af0c790933';
export default node;
