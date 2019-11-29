/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type TweetStatus = "CANCELED" | "DRAFT" | "POSTED" | "%future added value";
export type CancelTweetInput = {
    readonly id: string;
};
export type CancelTweetMutationVariables = {
    input: CancelTweetInput;
};
export type CancelTweetMutationResponse = {
    readonly cancelTweet: {
        readonly tweet: {
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
    tweet {
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
    "type": "CancelTweetInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "cancelTweet",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "CancelTweetPayload",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "tweet",
        "storageKey": null,
        "args": null,
        "concreteType": "Tweet",
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
    "name": "CancelTweetMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "CancelTweetMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "CancelTweetMutation",
    "id": null,
    "text": "mutation CancelTweetMutation(\n  $input: CancelTweetInput!\n) {\n  cancelTweet(input: $input) {\n    tweet {\n      id\n      status\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'e67e42af2d62598907b0627b374ac401';
export default node;
