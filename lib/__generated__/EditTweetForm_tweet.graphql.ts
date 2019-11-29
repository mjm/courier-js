/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type EditTweetForm_tweet = {
    readonly id: string;
    readonly body: string;
    readonly mediaURLs: ReadonlyArray<string>;
    readonly " $refType": "EditTweetForm_tweet";
};
export type EditTweetForm_tweet$data = EditTweetForm_tweet;
export type EditTweetForm_tweet$key = {
    readonly " $data"?: EditTweetForm_tweet$data;
    readonly " $fragmentRefs": FragmentRefs<"EditTweetForm_tweet">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "EditTweetForm_tweet",
  "type": "Tweet",
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
(node as any).hash = '37d5a2593fd17e6e81dffb1d71d0c32b';
export default node;
