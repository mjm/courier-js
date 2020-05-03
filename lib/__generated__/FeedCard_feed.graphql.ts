/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FeedCard_feed = {
    readonly id: string;
    readonly title: string;
    readonly homePageURL: string;
    readonly refreshedAt: any | null;
    readonly autopost: boolean;
    readonly " $refType": "FeedCard_feed";
};
export type FeedCard_feed$data = FeedCard_feed;
export type FeedCard_feed$key = {
    readonly " $data"?: FeedCard_feed$data;
    readonly " $fragmentRefs": FragmentRefs<"FeedCard_feed">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "FeedCard_feed",
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
      "name": "homePageURL",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "refreshedAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "autopost",
      "storageKey": null
    }
  ],
  "type": "Feed"
};
(node as any).hash = '0ab12db66a13c7f9e2c4dbf1e58caddb';
export default node;
