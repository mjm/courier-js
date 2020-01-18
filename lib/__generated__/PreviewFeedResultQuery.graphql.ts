/* tslint:disable */
/* @relayHash c90b6dcb2d7ad438e406b80759984699 */

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

fragment EditTweetForm_tweet on Tweet {
  id
  body
  mediaURLs
}

fragment PreviewFeedContent_feed on FeedPreview {
  url
  title
  tweets {
    ...TweetCard_tweet
  }
}

fragment TweetCard_tweet on TweetContent {
  ...EditTweetForm_tweet
  ...ViewTweet_tweet
  ... on Tweet {
    status
  }
}

fragment ViewTweet_tweet on TweetContent {
  body
  mediaURLs
  action
  retweetID
  ... on Tweet {
    id
    status
    postAfter
    postedAt
    postedTweetID
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
                "name": "action",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "retweetID",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "InlineFragment",
                "type": "Tweet",
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "id",
                    "args": null,
                    "storageKey": null
                  },
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
                    "name": "postAfter",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "postedAt",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "postedTweetID",
                    "args": null,
                    "storageKey": null
                  }
                ]
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
    "text": "query PreviewFeedResultQuery(\n  $url: String!\n) {\n  feedPreview(url: $url) {\n    ...PreviewFeedContent_feed\n  }\n}\n\nfragment EditTweetForm_tweet on Tweet {\n  id\n  body\n  mediaURLs\n}\n\nfragment PreviewFeedContent_feed on FeedPreview {\n  url\n  title\n  tweets {\n    ...TweetCard_tweet\n  }\n}\n\nfragment TweetCard_tweet on TweetContent {\n  ...EditTweetForm_tweet\n  ...ViewTweet_tweet\n  ... on Tweet {\n    status\n  }\n}\n\nfragment ViewTweet_tweet on TweetContent {\n  body\n  mediaURLs\n  action\n  retweetID\n  ... on Tweet {\n    id\n    status\n    postAfter\n    postedAt\n    postedTweetID\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'b70e1915a073e6440ef652a3758524ff';
export default node;
