/* tslint:disable */
/* @relayHash 329e723442197088066ccb08a6974689 */

import { ConcreteRequest } from "relay-runtime";
export type TweetStatus = "CANCELED" | "DRAFT" | "POSTED" | "%future added value";
export type UncancelTweetInput = {
    readonly id: string;
};
export type UncancelTweetMutationVariables = {
    input: UncancelTweetInput;
};
export type UncancelTweetMutationResponse = {
    readonly uncancelTweet: {
        readonly tweetGroup: {
            readonly id: string;
            readonly status: TweetStatus;
        };
    };
};
export type UncancelTweetMutation = {
    readonly response: UncancelTweetMutationResponse;
    readonly variables: UncancelTweetMutationVariables;
};



/*
mutation UncancelTweetMutation(
  $input: UncancelTweetInput!
) {
  uncancelTweet(input: $input) {
    tweetGroup {
      id
      status
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "UncancelTweetInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "uncancelTweet",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "UncancelTweetPayload",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "tweetGroup",
        "storageKey": null,
        "args": null,
        "concreteType": "TweetGroup",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
            "args": null,
            "storageKey": null
          },
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
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "UncancelTweetMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "UncancelTweetMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "UncancelTweetMutation",
    "id": null,
    "text": "mutation UncancelTweetMutation(\n  $input: UncancelTweetInput!\n) {\n  uncancelTweet(input: $input) {\n    tweetGroup {\n      id\n      status\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'dcce51d9b3722f5d84c3e409fe317355';
export default node;
