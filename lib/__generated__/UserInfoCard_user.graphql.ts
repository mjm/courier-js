/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type UserInfoCard_user = {
    readonly name: string;
    readonly nickname: string;
    readonly picture: string;
    readonly " $refType": "UserInfoCard_user";
};
export type UserInfoCard_user$data = UserInfoCard_user;
export type UserInfoCard_user$key = {
    readonly " $data"?: UserInfoCard_user$data;
    readonly " $fragmentRefs": FragmentRefs<"UserInfoCard_user">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "UserInfoCard_user",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "nickname",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "picture",
      "storageKey": null
    }
  ],
  "type": "Viewer"
};
(node as any).hash = '8638c54f0e7e53816614217fb9747a09';
export default node;
