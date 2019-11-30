/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FeedRemoveCard_feed = {
    readonly id: string;
    readonly " $refType": "FeedRemoveCard_feed";
};
export type FeedRemoveCard_feed$data = FeedRemoveCard_feed;
export type FeedRemoveCard_feed$key = {
    readonly " $data"?: FeedRemoveCard_feed$data;
    readonly " $fragmentRefs": FragmentRefs<"FeedRemoveCard_feed">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "FeedRemoveCard_feed",
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
    }
  ]
};
(node as any).hash = '9cada22c3c46193c8a1207f1713c8641';
export default node;
