/* tslint:disable */

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
        readonly tweet: {
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
    "text": "mutation UncancelTweetMutation(\n  $input: UncancelTweetInput!\n) {\n  uncancelTweet(input: $input) {\n    tweet {\n      id\n      status\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '2813f96f4564ab200bc7b6342b9576ea';
export default node;
