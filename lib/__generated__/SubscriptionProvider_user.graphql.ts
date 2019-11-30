/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SubscriptionStatus = "ACTIVE" | "CANCELED" | "EXPIRED" | "INACTIVE" | "%future added value";
export type SubscriptionProvider_user = {
    readonly subscription: {
        readonly status: SubscriptionStatus;
    } | null;
    readonly subscriptionStatusOverride: SubscriptionStatus | null;
    readonly " $refType": "SubscriptionProvider_user";
};
export type SubscriptionProvider_user$data = SubscriptionProvider_user;
export type SubscriptionProvider_user$key = {
    readonly " $data"?: SubscriptionProvider_user$data;
    readonly " $fragmentRefs": FragmentRefs<"SubscriptionProvider_user">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "SubscriptionProvider_user",
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
(node as any).hash = 'c1f3ee1fe0cbc209f01abb17344cc064';
export default node;
