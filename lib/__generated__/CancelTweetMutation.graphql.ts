/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
export type TweetStatus = "CANCELED" | "DRAFT" | "POSTED" | "%future added value";
export type CancelTweetInput = {
    id: string;
};
export type CancelTweetMutationVariables = {
    input: CancelTweetInput;
};
export type CancelTweetMutationResponse = {
    readonly cancelTweet: {
        readonly tweetGroup: {
            readonly id: string;
            readonly status: TweetStatus;
        };
    };
};
export type CancelTweetMutation = {
    readonly response: CancelTweetMutationResponse;
    readonly variables: CancelTweetMutationVariables;
};



/*
mutation CancelTweetMutation(
  $input: CancelTweetInput!
) {
  cancelTweet(input: $input) {
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
    "type": "CancelTweetInput!"
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
    "concreteType": "CancelTweetPayload",
    "kind": "LinkedField",
    "name": "cancelTweet",
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
    "name": "CancelTweetMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CancelTweetMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "CancelTweetMutation",
    "operationKind": "mutation",
    "text": "mutation CancelTweetMutation(\n  $input: CancelTweetInput!\n) {\n  cancelTweet(input: $input) {\n    tweetGroup {\n      id\n      status\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '972dece6dd97d52438f3b153e7ce41f7';
export default node;
