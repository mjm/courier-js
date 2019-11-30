/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SubscriptionStatus = "ACTIVE" | "CANCELED" | "EXPIRED" | "INACTIVE" | "%future added value";
export type SubscriptionInfoCard_user = {
    readonly customer: {
        readonly creditCard: {
            readonly " $fragmentRefs": FragmentRefs<"CreditCard_card">;
        } | null;
    } | null;
    readonly subscription: {
        readonly status: SubscriptionStatus;
        readonly periodEnd: any;
    } | null;
    readonly subscriptionStatusOverride: SubscriptionStatus | null;
    readonly " $fragmentRefs": FragmentRefs<"SubscriptionStatus_user">;
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
              "kind": "FragmentSpread",
              "name": "CreditCard_card",
              "args": null
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
    },
    {
      "kind": "FragmentSpread",
      "name": "SubscriptionStatus_user",
      "args": null
    }
  ]
};
(node as any).hash = 'd308fc780bc21d3bd2a9ab6559be843a';
export default node;
