/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type TweetAction = "RETWEET" | "TWEET" | "%future added value";
export type TweetStatus = "CANCELED" | "DRAFT" | "POSTED" | "%future added value";
export type ViewTweetGroup_tweet = {
    readonly tweets: ReadonlyArray<{
        readonly body: string;
        readonly mediaURLs: ReadonlyArray<string>;
        readonly postedTweetID: string | null;
        readonly " $fragmentRefs": FragmentRefs<"ViewTweet_tweet">;
    }>;
    readonly action: TweetAction;
    readonly retweetID: string;
    readonly id?: string;
    readonly status?: TweetStatus;
    readonly postAfter?: any | null;
    readonly postedAt?: any | null;
    readonly postedRetweetID?: string | null;
    readonly " $refType": "ViewTweetGroup_tweet";
};
export type ViewTweetGroup_tweet$data = ViewTweetGroup_tweet;
export type ViewTweetGroup_tweet$key = {
    readonly " $data"?: ViewTweetGroup_tweet$data;
    readonly " $fragmentRefs": FragmentRefs<"ViewTweetGroup_tweet">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ViewTweetGroup_tweet",
  "selections": [
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
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "ViewTweet_tweet"
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "action",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "retweetID",
      "storageKey": null
    },
    {
      "kind": "InlineFragment",
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
          "kind": "ScalarField",
          "name": "status",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "postAfter",
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
          "name": "postedRetweetID",
          "storageKey": null
        }
      ],
      "type": "TweetGroup"
    }
  ],
  "type": "TweetContent"
};
(node as any).hash = 'e232fb0222636f3062a905254515cf2b';
export default node;
