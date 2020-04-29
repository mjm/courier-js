/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
export type EditTweetInput = {
    id: string;
    tweets: Array<TweetEdit>;
};
export type TweetEdit = {
    body: string;
    mediaURLs?: Array<string> | null;
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
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input",
    "type": "EditTweetInput!"
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
    "concreteType": "EditTweetPayload",
    "kind": "LinkedField",
    "name": "editTweet",
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
            "concreteType": "Tweet",
            "kind": "LinkedField",
            "name": "tweets",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "body",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "mediaURLs",
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "EditTweetMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EditTweetMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "EditTweetMutation",
    "operationKind": "mutation",
    "text": "mutation EditTweetMutation(\n  $input: EditTweetInput!\n) {\n  editTweet(input: $input) {\n    tweetGroup {\n      id\n      tweets {\n        body\n        mediaURLs\n      }\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '5d598b2604af54ca63fcc03ab86e7995';
export default node;
