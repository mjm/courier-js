/* tslint:disable */

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
  "kind": "Fragment",
  "name": "ViewTweetGroup_tweet",
  "type": "TweetContent",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
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
        },
        {
          "kind": "FragmentSpread",
          "name": "ViewTweet_tweet",
          "args": null
        }
      ]
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
      "type": "TweetGroup",
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
          "name": "postedRetweetID",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = 'e232fb0222636f3062a905254515cf2b';
export default node;
