/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type TweetStatus = "CANCELED" | "DRAFT" | "POSTED" | "%future added value";
export type TweetCard_tweet = {
    readonly status: TweetStatus;
    readonly " $fragmentRefs": FragmentRefs<"EditTweetForm_tweet" | "ViewTweet_tweet">;
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
  "type": "Tweet",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "status",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "FragmentSpread",
      "name": "EditTweetForm_tweet",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ViewTweet_tweet",
      "args": null
    }
  ]
};
(node as any).hash = '1f6401d667bec883f77d8d28eedfd46f';
export default node;
