/* tslint:disable */
/* eslint-disable */

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
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "FeedInfoCard_user",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "micropubSites",
      "storageKey": null
    }
  ],
  "type": "Viewer"
};
(node as any).hash = '94a88089e9d258869afd2264fca43234';
export default node;
