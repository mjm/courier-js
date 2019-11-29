/* tslint:disable */

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
        readonly tweet: {
            readonly id: string;
            readonly body: string;
            readonly mediaURLs: ReadonlyArray<string>;
            readonly status: TweetStatus;
            readonly postedAt: any | null;
            readonly postedTweetID: string | null;
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
    tweet {
      id
      body
      mediaURLs
      status
      postedAt
      postedTweetID
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
            "name": "postedTweetID",
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
    "text": "mutation PostTweetMutation(\n  $input: PostTweetInput!\n) {\n  postTweet(input: $input) {\n    tweet {\n      id\n      body\n      mediaURLs\n      status\n      postedAt\n      postedTweetID\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'f7634f397b5d8c77896a5589b9f10fbc';
export default node;
