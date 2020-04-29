/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type TweetStatus = "CANCELED" | "DRAFT" | "POSTED" | "%future added value";
export type TweetCard_tweet = {
    readonly status?: TweetStatus;
    readonly " $fragmentRefs": FragmentRefs<"EditTweetForm_tweet" | "ViewTweetGroup_tweet">;
    readonly " $refType": "TweetCard_tweet";
};
export type TweetCard_tweet$data = TweetCard_tweet;
export type TweetCard_tweet$key = {
    readonly " $data"?: TweetCard_tweet$data;
    readonly " $fragmentRefs": FragmentRefs<"TweetCard_tweet">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TweetCard_tweet",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "EditTweetForm_tweet"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ViewTweetGroup_tweet"
    },
    {
      "kind": "InlineFragment",
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "status",
          "storageKey": null
        }
      ],
      "type": "TweetGroup"
    }
  ],
  "type": "TweetContent"
};
(node as any).hash = 'ab036e7620f610eed5e8f167e684f121';
export default node;
