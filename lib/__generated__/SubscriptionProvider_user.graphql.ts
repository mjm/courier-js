/* tslint:disable */
/* eslint-disable */

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
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SubscriptionProvider_user",
  "selections": [
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
(node as any).hash = '76f0838cd08629c038e6d69adf6dff78';
export default node;
