/* tslint:disable */

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
  "kind": "Fragment",
  "name": "FeedInfoCard_feed",
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
      "name": "url",
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
      "name": "micropubEndpoint",
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
      "name": "refreshing",
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
(node as any).hash = '79672f97440b5e05563c18da25333642';
export default node;
