/* tslint:disable */

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
  "kind": "Fragment",
  "name": "FeedDetails_user",
  "type": "User",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "FeedInfoCard_user",
      "args": null
    }
  ]
};
(node as any).hash = 'eb8bd12abe2bed8edf03cc11b99e4487';
export default node;
