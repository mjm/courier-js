/* tslint:disable */

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
  "kind": "Fragment",
  "name": "SubscriptionInfoCard_user",
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
            }
          ]
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "subscription",
      "storageKey": null,
      "args": null,
      "concreteType": "UserSubscription",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "status",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "periodEnd",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "subscriptionStatusOverride",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '4e4dd90b8c39e7864f237d4e9a3b511c';
export default node;
