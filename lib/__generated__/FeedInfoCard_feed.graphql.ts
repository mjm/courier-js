/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FeedInfoCard_feed = {
    readonly feed: {
        readonly id: string;
        readonly url: string;
        readonly homePageURL: string;
        readonly micropubEndpoint: string;
        readonly refreshedAt: any | null;
    };
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
  "type": "SubscribedFeed",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
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
        }
      ]
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
(node as any).hash = '707e006720ebc8c4b4e733ac302b4d32';
export default node;
