/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FeedDetails_user = {
    readonly " $fragmentRefs": FragmentRefs<"FeedInfoCard_user">;
    readonly " $refType": "FeedDetails_user";
};
export type FeedDetails_user$data = FeedDetails_user;
export type FeedDetails_user$key = {
    readonly " $data"?: FeedDetails_user$data;
    readonly " $fragmentRefs": FragmentRefs<"FeedDetails_user">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "FeedDetails_user",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "FeedInfoCard_user"
    }
  ],
  "type": "Viewer"
};
(node as any).hash = 'aa5bb8b20b81c12252105438e6665685';
export default node;
