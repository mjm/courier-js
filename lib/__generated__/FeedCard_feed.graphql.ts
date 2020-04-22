/* tslint:disable */

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
  "kind": "Fragment",
  "name": "FeedCard_feed",
  "type": "Feed",
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
      "kind": "ScalarField",
      "alias": null,
      "name": "title",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "homePageURL",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "refreshedAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "autopost",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '0ab12db66a13c7f9e2c4dbf1e58caddb';
export default node;
