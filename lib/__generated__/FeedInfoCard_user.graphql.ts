/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FeedInfoCard_user = {
    readonly micropubSites: ReadonlyArray<string>;
    readonly " $refType": "FeedInfoCard_user";
};
export type FeedInfoCard_user$data = FeedInfoCard_user;
export type FeedInfoCard_user$key = {
    readonly " $data"?: FeedInfoCard_user$data;
    readonly " $fragmentRefs": FragmentRefs<"FeedInfoCard_user">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "FeedInfoCard_user",
  "type": "User",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "micropubSites",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'bc9734e8450bbe6fbeea99948b1f350d';
export default node;
