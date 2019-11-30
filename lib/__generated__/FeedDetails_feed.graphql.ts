/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FeedDetails_feed = {
    readonly id: string;
    readonly feed: {
        readonly title: string;
        readonly " $fragmentRefs": FragmentRefs<"FeedInfoCard_feed" | "FeedRecentPostList_feed">;
    };
    readonly " $fragmentRefs": FragmentRefs<"FeedAutopostCard_feed" | "FeedRemoveCard_feed">;
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
          "kind": "FragmentSpread",
          "name": "FeedInfoCard_feed",
          "args": null
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
      "name": "FeedAutopostCard_feed",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "FeedRemoveCard_feed",
      "args": null
    }
  ]
};
(node as any).hash = '8c490d37ae428b453973f98563dae41d';
export default node;
