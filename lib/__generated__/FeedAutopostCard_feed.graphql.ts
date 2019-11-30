/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FeedAutopostCard_feed = {
    readonly id: string;
    readonly autopost: boolean;
    readonly " $refType": "FeedAutopostCard_feed";
};
export type FeedAutopostCard_feed$data = FeedAutopostCard_feed;
export type FeedAutopostCard_feed$key = {
    readonly " $data"?: FeedAutopostCard_feed$data;
    readonly " $fragmentRefs": FragmentRefs<"FeedAutopostCard_feed">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "FeedAutopostCard_feed",
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
      "kind": "ScalarField",
      "alias": null,
      "name": "autopost",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '480aa8c6be6b84659fa378e87599bce3';
export default node;
