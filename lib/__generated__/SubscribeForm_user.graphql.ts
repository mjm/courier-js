/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SubscribeForm_user = {
    readonly customer: {
        readonly creditCard: {
            readonly brand: string;
            readonly lastFour: string;
            readonly expirationMonth: number;
            readonly expirationYear: number;
        } | null;
    } | null;
    readonly " $refType": "SubscribeForm_user";
};
export type SubscribeForm_user$data = SubscribeForm_user;
export type SubscribeForm_user$key = {
    readonly " $data"?: SubscribeForm_user$data;
    readonly " $fragmentRefs": FragmentRefs<"SubscribeForm_user">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SubscribeForm_user",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Customer",
      "kind": "LinkedField",
      "name": "customer",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "CreditCard",
          "kind": "LinkedField",
          "name": "creditCard",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "brand",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "lastFour",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "expirationMonth",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "expirationYear",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Viewer"
};
(node as any).hash = 'a07ed9fabde45c87c8ffafd39a110259';
export default node;
