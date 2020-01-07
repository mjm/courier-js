/* tslint:disable */
/* @relayHash 4203d4ba10c8f7b35bc9567cc0d2599c */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PreviewFeedResultQueryVariables = {
    url: string;
};
export type PreviewFeedResultQueryResponse = {
    readonly feedPreview: {
        readonly " $fragmentRefs": FragmentRefs<"PreviewFeedContent_feed">;
    } | null;
};
export type PreviewFeedResultQuery = {
    readonly response: PreviewFeedResultQueryResponse;
    readonly variables: PreviewFeedResultQueryVariables;
};



/*
query PreviewFeedResultQuery(
  $url: String!
) {
  feedPreview(url: $url) {
    ...PreviewFeedContent_feed
  }
}

fragment PreviewFeedContent_feed on FeedPreview {
  url
  title
  tweets {
    action
    body
    mediaURLs
    retweetID
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "url",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "url",
    "variableName": "url"
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "PreviewFeedResultQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "feedPreview",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "FeedPreview",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "PreviewFeedContent_feed",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "PreviewFeedResultQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "feedPreview",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "FeedPreview",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "url",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "title",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "tweets",
            "storageKey": null,
            "args": null,
            "concreteType": "TweetPreview",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "action",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "body",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "mediaURLs",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "retweetID",
                "args": null,
                "storageKey": null
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "PreviewFeedResultQuery",
    "id": null,
    "text": "query PreviewFeedResultQuery(\n  $url: String!\n) {\n  feedPreview(url: $url) {\n    ...PreviewFeedContent_feed\n  }\n}\n\nfragment PreviewFeedContent_feed on FeedPreview {\n  url\n  title\n  tweets {\n    action\n    body\n    mediaURLs\n    retweetID\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'b70e1915a073e6440ef652a3758524ff';
export default node;
