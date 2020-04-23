/* tslint:disable */
/* @relayHash fe0f4df90b601d9be46abcb7e9a25a0c */

import { ConcreteRequest } from "relay-runtime";
export type TweetStatus = "CANCELED" | "DRAFT" | "POSTED" | "%future added value";
export type PostTweetInput = {
    readonly id: string;
    readonly body?: string | null;
    readonly mediaURLs?: ReadonlyArray<string> | null;
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
    "kind": "LocalArgument",
    "name": "input",
    "type": "PostTweetInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "postTweet",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "PostTweetPayload",
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
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "postedTweetID",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "status",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "postedAt",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "postAfter",
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
    "name": "PostTweetMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "PostTweetMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "PostTweetMutation",
    "id": null,
    "text": "mutation PostTweetMutation(\n  $input: PostTweetInput!\n) {\n  postTweet(input: $input) {\n    tweetGroup {\n      id\n      tweets {\n        body\n        mediaURLs\n        postedTweetID\n      }\n      status\n      postedAt\n      postAfter\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '56c9e238cc3a6ba6fa9e6bc4738e92a0';
export default node;
