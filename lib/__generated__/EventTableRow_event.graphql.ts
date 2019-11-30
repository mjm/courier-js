/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type EventType = "FEED_REFRESH" | "FEED_SET_AUTOPOST" | "FEED_SUBSCRIBE" | "FEED_UNSUBSCRIBE" | "SUBSCRIPTION_CANCEL" | "SUBSCRIPTION_CREATE" | "SUBSCRIPTION_EXPIRE" | "SUBSCRIPTION_REACTIVATE" | "SUBSCRIPTION_RENEW" | "TWEET_AUTOPOST" | "TWEET_CANCEL" | "TWEET_EDIT" | "TWEET_POST" | "TWEET_UNCANCEL" | "%future added value";
export type EventTableRow_event = {
    readonly id: string;
    readonly eventType: EventType;
    readonly createdAt: any;
    readonly feed: {
        readonly id: string;
        readonly title: string;
    } | null;
    readonly tweet: {
        readonly id: string;
        readonly body: string;
    } | null;
    readonly boolValue: boolean | null;
    readonly " $refType": "EventTableRow_event";
};
export type EventTableRow_event$data = EventTableRow_event;
export type EventTableRow_event$key = {
    readonly " $data"?: EventTableRow_event$data;
    readonly " $fragmentRefs": FragmentRefs<"EventTableRow_event">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "EventTableRow_event",
  "type": "Event",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    (v0/*: any*/),
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "eventType",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "createdAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "feed",
      "storageKey": null,
      "args": null,
      "concreteType": "Feed",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "title",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "tweet",
      "storageKey": null,
      "args": null,
      "concreteType": "Tweet",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "body",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "boolValue",
      "args": null,
      "storageKey": null
    }
  ]
};
})();
(node as any).hash = 'b202f3e367f9f489416a7d6261b369b8';
export default node;
