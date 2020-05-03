/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FeedDetails_feed = {
    readonly id: string;
    readonly title: string;
    readonly url: string;
    readonly " $fragmentRefs": FragmentRefs<"FeedRecentPostList_feed" | "FeedInfoCard_feed" | "FeedRemoveButton_feed">;
    readonly " $refType": "FeedDetails_feed";
};
export type FeedDetails_feed$data = FeedDetails_feed;
export type FeedDetails_feed$key = {
    readonly " $data"?: FeedDetails_feed$data;
    readonly " $fragmentRefs": FragmentRefs<"FeedDetails_feed">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "FeedDetails_feed",
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
      "name": "title",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "url",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "FeedRecentPostList_feed"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "FeedInfoCard_feed"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "FeedRemoveButton_feed"
    }
  ],
  "type": "Feed"
};
(node as any).hash = '03d906736fdcf774215f6f91c6195e59';
export default node;
