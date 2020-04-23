/* tslint:disable */

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
  "kind": "Fragment",
  "name": "EditTweetForm_tweet",
  "type": "TweetGroup",
  "metadata": null,
  "argumentDefinitions": [],
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
};
(node as any).hash = '1c44bd76b098a5f26fdbfa25b45a00ce';
export default node;
