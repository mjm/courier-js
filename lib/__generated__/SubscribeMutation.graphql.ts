/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
export type SubscriptionStatus = "ACTIVE" | "CANCELED" | "EXPIRED" | "INACTIVE" | "%future added value";
export type SubscribeInput = {
    paymentMethodID?: string | null;
    email?: string | null;
};
export type SubscribeMutationVariables = {
    input: SubscribeInput;
};
export type SubscribeMutationResponse = {
    readonly subscribe: {
        readonly user: {
            readonly customer: {
                readonly creditCard: {
                    readonly brand: string;
                    readonly lastFour: string;
                    readonly expirationMonth: number;
                    readonly expirationYear: number;
                } | null;
            } | null;
            readonly subscription: {
                readonly status: SubscriptionStatus;
                readonly periodEnd: any;
            } | null;
        };
    };
};
export type SubscribeMutation = {
    readonly response: SubscribeMutationResponse;
    readonly variables: SubscribeMutationVariables;
};



/*
mutation SubscribeMutation(
  $input: SubscribeInput!
) {
  subscribe(input: $input) {
    user {
      customer {
        creditCard {
          brand
          lastFour
          expirationMonth
          expirationYear
        }
      }
      subscription {
        status
        periodEnd
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
    "type": "SubscribeInput!"
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
    "concreteType": "SubscribePayload",
    "kind": "LinkedField",
    "name": "subscribe",
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
            "concreteType": "Customer",
            "kind": "LinkedField",
            "name": "customer",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "CreditCard",
                "kind": "LinkedField",
                "name": "creditCard",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "brand",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "lastFour",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "expirationMonth",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "expirationYear",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
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
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "periodEnd",
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
    "name": "SubscribeMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SubscribeMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "SubscribeMutation",
    "operationKind": "mutation",
    "text": "mutation SubscribeMutation(\n  $input: SubscribeInput!\n) {\n  subscribe(input: $input) {\n    user {\n      customer {\n        creditCard {\n          brand\n          lastFour\n          expirationMonth\n          expirationYear\n        }\n      }\n      subscription {\n        status\n        periodEnd\n      }\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '941558cd735341fcfad0848934b95163';
export default node;
