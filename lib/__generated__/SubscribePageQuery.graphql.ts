/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SubscribePageQueryVariables = {};
export type SubscribePageQueryResponse = {
    readonly viewer: {
        readonly " $fragmentRefs": FragmentRefs<"SubscribeForm_user">;
    } | null;
};
export type SubscribePageQuery = {
    readonly response: SubscribePageQueryResponse;
    readonly variables: SubscribePageQueryVariables;
};



/*
query SubscribePageQuery {
  viewer {
    ...SubscribeForm_user
  }
}

fragment SubscribeForm_user on Viewer {
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
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "SubscribePageQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Viewer",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "SubscribeForm_user"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SubscribePageQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Viewer",
        "kind": "LinkedField",
        "name": "viewer",
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
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "SubscribePageQuery",
    "operationKind": "query",
    "text": "query SubscribePageQuery {\n  viewer {\n    ...SubscribeForm_user\n  }\n}\n\nfragment SubscribeForm_user on Viewer {\n  customer {\n    creditCard {\n      brand\n      lastFour\n      expirationMonth\n      expirationYear\n    }\n  }\n}\n"
  }
};
(node as any).hash = 'ec1e4355ddb94ba2a0b7e029c48c6465';
export default node;
