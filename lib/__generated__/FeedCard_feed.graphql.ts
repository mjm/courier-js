/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FeedCard_feed = {
    readonly id: string;
    readonly feed: {
        readonly id: string;
        readonly url: string;
        readonly title: string;
        readonly homePageURL: string;
        readonly micropubEndpoint: string;
        readonly refreshedAt: any | null;
    };
    readonly autopost: boolean;
    readonly " $refType": "FeedCard_feed";
};
export type FeedCard_feed$data = FeedCard_feed;
export type FeedCard_feed$key = {
    readonly " $data"?: FeedCard_feed$data;
    readonly " $fragmentRefs": FragmentRefs<"FeedCard_feed">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "FeedCard_feed",
  "type": "SubscribedFeed",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    (v0/*: any*/),
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "feed",
      "storageKey": null,
      "args": null,
      "concreteType": "Feed",
      "plural": false,
      "selections": [
        (v0/*: any*/),
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
})();
(node as any).hash = '55df52bc602a10a8b57e338633e25525';
export default node;
