/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FeedDetails_feed = {
    readonly id: string;
    readonly feed: {
        readonly title: string;
        readonly url: string;
        readonly " $fragmentRefs": FragmentRefs<"FeedRecentPostList_feed">;
    };
    readonly " $fragmentRefs": FragmentRefs<"FeedInfoCard_feed" | "FeedRemoveButton_feed">;
    readonly " $refType": "FeedDetails_feed";
};
export type FeedDetails_feed$data = FeedDetails_feed;
export type FeedDetails_feed$key = {
    readonly " $data"?: FeedDetails_feed$data;
    readonly " $fragmentRefs": FragmentRefs<"FeedDetails_feed">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "FeedDetails_feed",
  "type": "SubscribedFeed",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "feed",
      "storageKey": null,
      "args": null,
      "concreteType": "Feed",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "title",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "url",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "FragmentSpread",
          "name": "FeedRecentPostList_feed",
          "args": null
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "FeedInfoCard_feed",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "FeedRemoveButton_feed",
      "args": null
    }
  ]
};
(node as any).hash = 'dc7ada0647de530c97101edf5f14e320';
export default node;
