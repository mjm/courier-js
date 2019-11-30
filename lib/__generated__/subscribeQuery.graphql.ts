/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type subscribeQueryVariables = {};
export type subscribeQueryResponse = {
    readonly currentUser: {
        readonly " $fragmentRefs": FragmentRefs<"SubscribeForm_user">;
    } | null;
};
export type subscribeQuery = {
    readonly response: subscribeQueryResponse;
    readonly variables: subscribeQueryVariables;
};



/*
query subscribeQuery {
  currentUser {
    ...SubscribeForm_user
  }
}

fragment SubscribeForm_user on User {
  customer {
    creditCard {
      brand
      lastFour
      expirationMonth
      expirationYear
    }
  }
}
*/

const node: ConcreteRequest = {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "subscribeQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "currentUser",
        "storageKey": null,
        "args": null,
        "concreteType": "User",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "SubscribeForm_user",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "subscribeQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "currentUser",
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
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "subscribeQuery",
    "id": null,
    "text": "query subscribeQuery {\n  currentUser {\n    ...SubscribeForm_user\n  }\n}\n\nfragment SubscribeForm_user on User {\n  customer {\n    creditCard {\n      brand\n      lastFour\n      expirationMonth\n      expirationYear\n    }\n  }\n}\n",
    "metadata": {}
  }
};
(node as any).hash = '7e2baeab559fdb8b54791a5cbc337748';
export default node;
