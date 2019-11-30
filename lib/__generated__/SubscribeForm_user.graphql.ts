/* tslint:disable */

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
  "kind": "Fragment",
  "name": "SubscribeForm_user",
  "type": "User",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "customer",
      "storageKey": null,
      "args": null,
      "concreteType": "Customer",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "creditCard",
          "storageKey": null,
          "args": null,
          "concreteType": "CreditCard",
          "plural": false,
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
        }
      ]
    }
  ]
};
(node as any).hash = 'ac9796175235ed3ae637fb3ba0da485e';
export default node;
