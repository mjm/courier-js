/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type TweetAction = "RETWEET" | "TWEET" | "%future added value";
export type PreviewFeedContent_feed = {
    readonly url: string;
    readonly title: string;
    readonly tweets: ReadonlyArray<{
        readonly action: TweetAction;
        readonly body: string;
        readonly mediaURLs: ReadonlyArray<string>;
        readonly retweetID: string;
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
          "kind": "ScalarField",
          "alias": null,
          "name": "action",
          "args": null,
          "storageKey": null
        },
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
          "name": "retweetID",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = '771c6059e258b33cd3bb01b08aa667b7';
export default node;
