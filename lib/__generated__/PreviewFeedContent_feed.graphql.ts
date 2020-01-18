/* tslint:disable */

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
  "kind": "Fragment",
  "name": "PreviewFeedContent_feed",
  "type": "FeedPreview",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "url",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "title",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "tweets",
      "storageKey": null,
      "args": null,
      "concreteType": "TweetPreview",
      "plural": true,
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "TweetCard_tweet",
          "args": null
        }
      ]
    }
  ]
};
(node as any).hash = 'dd734b77513b29c475bf8f9e50bc6935';
export default node;
