/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FeedRemoveButton_feed = {
    readonly id: string;
    readonly feed: {
        readonly title: string;
    };
    readonly " $refType": "FeedRemoveButton_feed";
};
export type FeedRemoveButton_feed$data = FeedRemoveButton_feed;
export type FeedRemoveButton_feed$key = {
    readonly " $data"?: FeedRemoveButton_feed$data;
    readonly " $fragmentRefs": FragmentRefs<"FeedRemoveButton_feed">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "FeedRemoveButton_feed",
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
        }
      ]
    }
  ]
};
(node as any).hash = '437de01bd89be67b0fc87f07495bae7f';
export default node;
