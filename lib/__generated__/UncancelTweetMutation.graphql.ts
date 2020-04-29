/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
export type TweetStatus = "CANCELED" | "DRAFT" | "POSTED" | "%future added value";
export type UncancelTweetInput = {
    id: string;
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
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input",
    "type": "UncancelTweetInput!"
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
    "concreteType": "UncancelTweetPayload",
    "kind": "LinkedField",
    "name": "uncancelTweet",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "TweetGroup",
        "kind": "LinkedField",
        "name": "tweetGroup",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "UncancelTweetMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UncancelTweetMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "UncancelTweetMutation",
    "operationKind": "mutation",
    "text": "mutation UncancelTweetMutation(\n  $input: UncancelTweetInput!\n) {\n  uncancelTweet(input: $input) {\n    tweetGroup {\n      id\n      status\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = 'dcce51d9b3722f5d84c3e409fe317355';
export default node;
