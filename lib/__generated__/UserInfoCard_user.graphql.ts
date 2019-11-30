/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type UserInfoCard_user = {
    readonly name: string;
    readonly nickname: string;
    readonly " $refType": "UserInfoCard_user";
};
export type UserInfoCard_user$data = UserInfoCard_user;
export type UserInfoCard_user$key = {
    readonly " $data"?: UserInfoCard_user$data;
    readonly " $fragmentRefs": FragmentRefs<"UserInfoCard_user">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "UserInfoCard_user",
  "type": "User",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "name",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "nickname",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '2db75790112cd809b38420f33fa8677d';
export default node;
