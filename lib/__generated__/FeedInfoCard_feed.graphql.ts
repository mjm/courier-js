/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FeedInfoCard_feed = {
    readonly id: string;
    readonly url: string;
    readonly homePageURL: string;
    readonly micropubEndpoint: string;
    readonly refreshedAt: any | null;
    readonly refreshing: boolean;
    readonly autopost: boolean;
    readonly " $refType": "FeedInfoCard_feed";
};
export type FeedInfoCard_feed$data = FeedInfoCard_feed;
export type FeedInfoCard_feed$key = {
    readonly " $data"?: FeedInfoCard_feed$data;
    readonly " $fragmentRefs": FragmentRefs<"FeedInfoCard_feed">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "FeedInfoCard_feed",
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
      "name": "url",
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
      "name": "micropubEndpoint",
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
      "name": "refreshing",
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
(node as any).hash = '79672f97440b5e05563c18da25333642';
export default node;
