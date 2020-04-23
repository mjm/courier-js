/* tslint:disable */

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
  "kind": "Fragment",
  "name": "TweetCard_tweet",
  "type": "TweetContent",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "EditTweetForm_tweet",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ViewTweetGroup_tweet",
      "args": null
    },
    {
      "kind": "InlineFragment",
      "type": "TweetGroup",
      "selections": [
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
};
(node as any).hash = 'ab036e7620f610eed5e8f167e684f121';
export default node;
