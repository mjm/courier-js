/* tslint:disable */
/* @relayHash a58e605fca6f34b0dc945903bce074de */

import { ConcreteRequest } from "relay-runtime";
export type EditTweetInput = {
    readonly id: string;
    readonly tweets: ReadonlyArray<TweetEdit>;
};
export type TweetEdit = {
    readonly body: string;
    readonly mediaURLs?: ReadonlyArray<string> | null;
};
export type EditTweetMutationVariables = {
    input: EditTweetInput;
};
export type EditTweetMutationResponse = {
    readonly editTweet: {
        readonly tweetGroup: {
            readonly id: string;
            readonly tweets: ReadonlyArray<{
                readonly body: string;
                readonly mediaURLs: ReadonlyArray<string>;
            }>;
        };
    };
};
export type EditTweetMutation = {
    readonly response: EditTweetMutationResponse;
    readonly variables: EditTweetMutationVariables;
};



/*
mutation EditTweetMutation(
  $input: EditTweetInput!
) {
  editTweet(input: $input) {
    tweetGroup {
      id
      tweets {
        body
        mediaURLs
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
    "type": "EditTweetInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "editTweet",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "EditTweetPayload",
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
            "kind": "LinkedField",
            "alias": null,
            "name": "tweets",
            "storageKey": null,
            "args": null,
            "concreteType": "Tweet",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "body",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "mediaURLs",
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
    "name": "EditTweetMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "EditTweetMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "EditTweetMutation",
    "id": null,
    "text": "mutation EditTweetMutation(\n  $input: EditTweetInput!\n) {\n  editTweet(input: $input) {\n    tweetGroup {\n      id\n      tweets {\n        body\n        mediaURLs\n      }\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '5d598b2604af54ca63fcc03ab86e7995';
export default node;
