/* tslint:disable */
/* @relayHash 2855d536ceae9be87ac5e855dd26d305 */

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

fragment EditTweetForm_tweet on TweetGroup {
  id
  tweets {
    body
    mediaURLs
  }
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
  ...ViewTweetGroup_tweet
  ... on TweetGroup {
    status
  }
}

fragment ViewTweetGroup_tweet on TweetContent {
  tweets {
    ...ViewTweet_tweet
    body
    mediaURLs
    postedTweetID
  }
  action
  retweetID
  ... on TweetGroup {
    id
    status
    postAfter
    postedAt
    postedRetweetID
  }
}

fragment ViewTweet_tweet on Tweet {
  body
  mediaURLs
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
                "kind": "LinkedField",
                "alias": null,
                "name": "tweets",
                "storageKey": null,
                "args": null,
                "concreteType": "Tweet",
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
                    "name": "postedTweetID",
                    "args": null,
                    "storageKey": null
                  }
                ]
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
                "type": "TweetGroup",
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
                    "name": "postedRetweetID",
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
    "text": "query PreviewFeedResultQuery(\n  $url: String!\n) {\n  feedPreview(url: $url) {\n    ...PreviewFeedContent_feed\n  }\n}\n\nfragment EditTweetForm_tweet on TweetGroup {\n  id\n  tweets {\n    body\n    mediaURLs\n  }\n}\n\nfragment PreviewFeedContent_feed on FeedPreview {\n  url\n  title\n  tweets {\n    ...TweetCard_tweet\n  }\n}\n\nfragment TweetCard_tweet on TweetContent {\n  ...EditTweetForm_tweet\n  ...ViewTweetGroup_tweet\n  ... on TweetGroup {\n    status\n  }\n}\n\nfragment ViewTweetGroup_tweet on TweetContent {\n  tweets {\n    ...ViewTweet_tweet\n    body\n    mediaURLs\n    postedTweetID\n  }\n  action\n  retweetID\n  ... on TweetGroup {\n    id\n    status\n    postAfter\n    postedAt\n    postedRetweetID\n  }\n}\n\nfragment ViewTweet_tweet on Tweet {\n  body\n  mediaURLs\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'b70e1915a073e6440ef652a3758524ff';
export default node;
