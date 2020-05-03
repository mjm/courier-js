/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SubscriptionStatus = "ACTIVE" | "CANCELED" | "EXPIRED" | "INACTIVE" | "%future added value";
export type SubscriptionInfoCard_user = {
    readonly customer: {
        readonly creditCard: {
            readonly brand: string;
            readonly lastFour: string;
        } | null;
    } | null;
    readonly subscription: {
        readonly status: SubscriptionStatus;
        readonly periodEnd: any;
    } | null;
    readonly subscriptionStatusOverride: SubscriptionStatus | null;
    readonly " $refType": "SubscriptionInfoCard_user";
};
export type SubscriptionInfoCard_user$data = SubscriptionInfoCard_user;
export type SubscriptionInfoCard_user$key = {
    readonly " $data"?: SubscriptionInfoCard_user$data;
    readonly " $fragmentRefs": FragmentRefs<"SubscriptionInfoCard_user">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SubscriptionInfoCard_user",
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
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "UserSubscription",
      "kind": "LinkedField",
      "name": "subscription",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "status",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "periodEnd",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "subscriptionStatusOverride",
      "storageKey": null
    }
  ],
  "type": "Viewer"
};
(node as any).hash = 'cf9df0952b410f9ee9d92be28423a2ad';
export default node;
