/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewTweet_tweet = {
    readonly body: string;
    readonly mediaURLs: ReadonlyArray<string>;
    readonly " $refType": "ViewTweet_tweet";
};
export type ViewTweet_tweet$data = ViewTweet_tweet;
export type ViewTweet_tweet$key = {
    readonly " $data"?: ViewTweet_tweet$data;
    readonly " $fragmentRefs": FragmentRefs<"ViewTweet_tweet">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ViewTweet_tweet",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "body",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "mediaURLs",
      "storageKey": null
    }
  ],
  "type": "Tweet"
};
(node as any).hash = '4ec25b6b9fe60d737f58e51e9c96f803';
export default node;
