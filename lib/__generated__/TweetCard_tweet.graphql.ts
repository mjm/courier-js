/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type TweetStatus = "CANCELED" | "DRAFT" | "POSTED" | "%future added value";
export type TweetCard_tweet = {
    readonly status?: TweetStatus;
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
      "name": "ViewTweet_tweet",
      "args": null
    },
    {
      "kind": "InlineFragment",
      "type": "Tweet",
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
(node as any).hash = '5cb56989d6e2006377e69ed3e92a3f42';
export default node;
