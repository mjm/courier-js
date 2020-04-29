/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PreviewFeedContent_feed = {
    readonly url: string;
    readonly title: string;
    readonly tweets: ReadonlyArray<{
        readonly " $fragmentRefs": FragmentRefs<"TweetCard_tweet">;
    }>;
    readonly " $refType": "PreviewFeedContent_feed";
};
export type PreviewFeedContent_feed$data = PreviewFeedContent_feed;
export type PreviewFeedContent_feed$key = {
    readonly " $data"?: PreviewFeedContent_feed$data;
    readonly " $fragmentRefs": FragmentRefs<"PreviewFeedContent_feed">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PreviewFeedContent_feed",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "url",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "title",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "TweetPreview",
      "kind": "LinkedField",
      "name": "tweets",
      "plural": true,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "TweetCard_tweet"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "FeedPreview"
};
(node as any).hash = 'dd734b77513b29c475bf8f9e50bc6935';
export default node;
