/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type TweetAction = "RETWEET" | "TWEET" | "%future added value";
export type TweetStatus = "CANCELED" | "DRAFT" | "POSTED" | "%future added value";
export type ViewTweet_tweet = {
    readonly body: string;
    readonly mediaURLs: ReadonlyArray<string>;
    readonly action: TweetAction;
    readonly retweetID: string;
    readonly id?: string;
    readonly status?: TweetStatus;
    readonly postAfter?: any | null;
    readonly postedAt?: any | null;
    readonly postedTweetID?: string | null;
    readonly " $refType": "ViewTweet_tweet";
};
export type ViewTweet_tweet$data = ViewTweet_tweet;
export type ViewTweet_tweet$key = {
    readonly " $data"?: ViewTweet_tweet$data;
    readonly " $fragmentRefs": FragmentRefs<"ViewTweet_tweet">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ViewTweet_tweet",
  "type": "TweetContent",
  "metadata": null,
  "argumentDefinitions": [],
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
      "name": "action",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "retweetID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "InlineFragment",
      "type": "Tweet",
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
          "name": "status",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "postAfter",
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
};
(node as any).hash = '4b64de34b31075007ff94db1e8d7cc09';
export default node;
