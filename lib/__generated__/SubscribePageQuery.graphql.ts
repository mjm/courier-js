/* tslint:disable */
/* @relayHash d3fcc49e4ed78bf9f1927c32fe9e63eb */

import { ConcreteRequest, FragmentRefs } from "relay-runtime"

export type SubscribePageQueryVariables = {}
export type SubscribePageQueryResponse = {
  readonly viewer: {
    readonly " $fragmentRefs": FragmentRefs<"SubscribeForm_user">
  } | null
}
export type SubscribePageQuery = {
  readonly response: SubscribePageQueryResponse
  readonly variables: SubscribePageQueryVariables
}

/*
query SubscribePageQuery {
  viewer {
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
  kind: "Request",
  fragment: {
    kind: "Fragment",
    name: "SubscribePageQuery",
    type: "Query",
    metadata: null,
    argumentDefinitions: [],
    selections: [
      {
        kind: "LinkedField",
        alias: null,
        name: "viewer",
        storageKey: null,
        args: null,
        concreteType: "User",
        plural: false,
        selections: [
          {
            kind: "FragmentSpread",
            name: "SubscribeForm_user",
            args: null,
          },
        ],
      },
    ],
  },
  operation: {
    kind: "Operation",
    name: "SubscribePageQuery",
    argumentDefinitions: [],
    selections: [
      {
        kind: "LinkedField",
        alias: null,
        name: "viewer",
        storageKey: null,
        args: null,
        concreteType: "User",
        plural: false,
        selections: [
          {
            kind: "LinkedField",
            alias: null,
            name: "customer",
            storageKey: null,
            args: null,
            concreteType: "Customer",
            plural: false,
            selections: [
              {
                kind: "LinkedField",
                alias: null,
                name: "creditCard",
                storageKey: null,
                args: null,
                concreteType: "CreditCard",
                plural: false,
                selections: [
                  {
                    kind: "ScalarField",
                    alias: null,
                    name: "brand",
                    args: null,
                    storageKey: null,
                  },
                  {
                    kind: "ScalarField",
                    alias: null,
                    name: "lastFour",
                    args: null,
                    storageKey: null,
                  },
                  {
                    kind: "ScalarField",
                    alias: null,
                    name: "expirationMonth",
                    args: null,
                    storageKey: null,
                  },
                  {
                    kind: "ScalarField",
                    alias: null,
                    name: "expirationYear",
                    args: null,
                    storageKey: null,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  params: {
    operationKind: "query",
    name: "SubscribePageQuery",
    id: null,
    text:
      "query SubscribePageQuery {\n  viewer {\n    ...SubscribeForm_user\n  }\n}\n\nfragment SubscribeForm_user on User {\n  customer {\n    creditCard {\n      brand\n      lastFour\n      expirationMonth\n      expirationYear\n    }\n  }\n}\n",
    metadata: {},
  },
}
;(node as any).hash = "ec1e4355ddb94ba2a0b7e029c48c6465"
export default node
