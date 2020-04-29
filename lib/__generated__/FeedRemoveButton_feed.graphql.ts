/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FeedRemoveButton_feed = {
    readonly id: string;
    readonly " $refType": "FeedRemoveButton_feed";
};
export type FeedRemoveButton_feed$data = FeedRemoveButton_feed;
export type FeedRemoveButton_feed$key = {
    readonly " $data"?: FeedRemoveButton_feed$data;
    readonly " $fragmentRefs": FragmentRefs<"FeedRemoveButton_feed">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "FeedRemoveButton_feed",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    }
  ],
  "type": "Feed"
};
(node as any).hash = 'd9c2540940c221f840dbd7e3ea514cd7';
export default node;
