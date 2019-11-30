/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CreditCard_card = {
    readonly brand: string;
    readonly lastFour: string;
    readonly expirationMonth: number;
    readonly expirationYear: number;
    readonly " $refType": "CreditCard_card";
};
export type CreditCard_card$data = CreditCard_card;
export type CreditCard_card$key = {
    readonly " $data"?: CreditCard_card$data;
    readonly " $fragmentRefs": FragmentRefs<"CreditCard_card">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "CreditCard_card",
  "type": "CreditCard",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "brand",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "lastFour",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "expirationMonth",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "expirationYear",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '0edc5adf0d63fba61741c762f36551a0';
export default node;
