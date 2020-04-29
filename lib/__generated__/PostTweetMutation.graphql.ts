/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
export type TweetStatus = "CANCELED" | "DRAFT" | "POSTED" | "%future added value";
export type PostTweetInput = {
    id: string;
    body?: string | null;
    mediaURLs?: Array<string> | null;
};
export type PostTweetMutationVariables = {
    input: PostTweetInput;
};
export type PostTweetMutationResponse = {
    readonly postTweet: {
        readonly tweetGroup: {
            readonly id: string;
            readonly tweets: ReadonlyArray<{
                readonly body: string;
                readonly mediaURLs: ReadonlyArray<string>;
                readonly postedTweetID: string | null;
            }>;
            readonly status: TweetStatus;
            readonly postedAt: any | null;
            readonly postAfter: any | null;
        };
    };
};
export type PostTweetMutation = {
    readonly response: PostTweetMutationResponse;
    readonly variables: PostTweetMutationVariables;
};



/*
mutation PostTweetMutation(
  $input: PostTweetInput!
) {
  postTweet(input: $input) {
    tweetGroup {
      id
      tweets {
        body
        mediaURLs
        postedTweetID
      }
      status
      postedAt
      postAfter
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
    "type": "PostTweetInput!"
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
    "concreteType": "PostTweetPayload",
    "kind": "LinkedField",
    "name": "postTweet",
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
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "postedTweetID",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "status",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "postedAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "postAfter",
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
    "name": "PostTweetMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PostTweetMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "PostTweetMutation",
    "operationKind": "mutation",
    "text": "mutation PostTweetMutation(\n  $input: PostTweetInput!\n) {\n  postTweet(input: $input) {\n    tweetGroup {\n      id\n      tweets {\n        body\n        mediaURLs\n        postedTweetID\n      }\n      status\n      postedAt\n      postAfter\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '56c9e238cc3a6ba6fa9e6bc4738e92a0';
export default node;
