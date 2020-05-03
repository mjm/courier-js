/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type EditTweetForm_tweet = {
    readonly id: string;
    readonly tweets: ReadonlyArray<{
        readonly body: string;
        readonly mediaURLs: ReadonlyArray<string>;
    }>;
    readonly " $refType": "EditTweetForm_tweet";
};
export type EditTweetForm_tweet$data = EditTweetForm_tweet;
export type EditTweetForm_tweet$key = {
    readonly " $data"?: EditTweetForm_tweet$data;
    readonly " $fragmentRefs": FragmentRefs<"EditTweetForm_tweet">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EditTweetForm_tweet",
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
  "type": "TweetGroup"
};
(node as any).hash = '1c44bd76b098a5f26fdbfa25b45a00ce';
export default node;
