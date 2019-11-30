/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type SubscriptionStatus = "ACTIVE" | "CANCELED" | "EXPIRED" | "INACTIVE" | "%future added value";
export type SubscribeInput = {
    readonly tokenID?: string | null;
    readonly email?: string | null;
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
    "kind": "LocalArgument",
    "name": "input",
    "type": "SubscribeInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "subscribe",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "SubscribePayload",
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
            "name": "customer",
            "storageKey": null,
            "args": null,
            "concreteType": "Customer",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "creditCard",
                "storageKey": null,
                "args": null,
                "concreteType": "CreditCard",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "brand",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "lastFour",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "expirationMonth",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "expirationYear",
                    "args": null,
                    "storageKey": null
                  }
                ]
              }
            ]
          },
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
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "periodEnd",
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
    "name": "SubscribeMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "SubscribeMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "SubscribeMutation",
    "id": null,
    "text": "mutation SubscribeMutation(\n  $input: SubscribeInput!\n) {\n  subscribe(input: $input) {\n    user {\n      customer {\n        creditCard {\n          brand\n          lastFour\n          expirationMonth\n          expirationYear\n        }\n      }\n      subscription {\n        status\n        periodEnd\n      }\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '941558cd735341fcfad0848934b95163';
export default node;
