/* tslint:disable */
/* eslint-disable */

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
    readonly tweetGroup: {
        readonly id: string;
        readonly tweets: ReadonlyArray<{
            readonly body: string;
        }>;
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EventTableRow_event",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "eventType",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "createdAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Feed",
      "kind": "LinkedField",
      "name": "feed",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "title",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "TweetGroup",
      "kind": "LinkedField",
      "name": "tweetGroup",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "Tweet",
          "kind": "LinkedField",
          "name": "tweets",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "body",
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
      "kind": "ScalarField",
      "name": "boolValue",
      "storageKey": null
    }
  ],
  "type": "Event"
};
})();
(node as any).hash = '651ad7daec887e52feaf98a8ae0c31dd';
export default node;
