/* tslint:disable */

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
  "kind": "Fragment",
  "name": "ViewTweet_tweet",
  "type": "Tweet",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "body",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "mediaURLs",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '4ec25b6b9fe60d737f58e51e9c96f803';
export default node;
