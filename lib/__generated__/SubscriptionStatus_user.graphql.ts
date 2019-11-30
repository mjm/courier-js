/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SubscriptionStatus = "ACTIVE" | "CANCELED" | "EXPIRED" | "INACTIVE" | "%future added value";
export type SubscriptionStatus_user = {
    readonly subscription: {
        readonly status: SubscriptionStatus;
    } | null;
    readonly subscriptionStatusOverride: SubscriptionStatus | null;
    readonly " $refType": "SubscriptionStatus_user";
};
export type SubscriptionStatus_user$data = SubscriptionStatus_user;
export type SubscriptionStatus_user$key = {
    readonly " $data"?: SubscriptionStatus_user$data;
    readonly " $fragmentRefs": FragmentRefs<"SubscriptionStatus_user">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "SubscriptionStatus_user",
  "type": "User",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
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
(node as any).hash = '8df1eb704af17a6711b72916c6a08fd3';
export default node;
