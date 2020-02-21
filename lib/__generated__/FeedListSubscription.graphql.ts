/* tslint:disable */
/* @relayHash dfa1a62314b1b5eca7a510da9c47dfe1 */

import { ConcreteRequest } from "relay-runtime"

export type FeedListSubscriptionVariables = {}
export type FeedListSubscriptionResponse = {
  readonly feedRefreshed: {
    readonly feed: {
      readonly id: string
      readonly refreshedAt: any | null
    } | null
  } | null
}
export type FeedListSubscription = {
  readonly response: FeedListSubscriptionResponse
  readonly variables: FeedListSubscriptionVariables
}

/*
subscription FeedListSubscription {
  feedRefreshed {
    feed {
      id
      refreshedAt
    }
  }
}
*/

const node: ConcreteRequest = (function() {
  var v0 = [
    {
      kind: "LinkedField",
      alias: null,
      name: "feedRefreshed",
      storageKey: null,
      args: null,
      concreteType: "FeedRefreshedEvent",
      plural: false,
      selections: [
        {
          kind: "LinkedField",
          alias: null,
          name: "feed",
          storageKey: null,
          args: null,
          concreteType: "Feed",
          plural: false,
          selections: [
            {
              kind: "ScalarField",
              alias: null,
              name: "id",
              args: null,
              storageKey: null,
            },
            {
              kind: "ScalarField",
              alias: null,
              name: "refreshedAt",
              args: null,
              storageKey: null,
            },
          ],
        },
      ],
    },
  ]
  return {
    kind: "Request",
    fragment: {
      kind: "Fragment",
      name: "FeedListSubscription",
      type: "Subscription",
      metadata: null,
      argumentDefinitions: [],
      selections: v0 /*: any*/,
    },
    operation: {
      kind: "Operation",
      name: "FeedListSubscription",
      argumentDefinitions: [],
      selections: v0 /*: any*/,
    },
    params: {
      operationKind: "subscription",
      name: "FeedListSubscription",
      id: null,
      text:
        "subscription FeedListSubscription {\n  feedRefreshed {\n    feed {\n      id\n      refreshedAt\n    }\n  }\n}\n",
      metadata: {},
    },
  }
})()
;(node as any).hash = "e81b915c227f62ec2e28755e708c8edf"
export default node
