/* tslint:disable */
/* eslint-disable */

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
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "url",
    "type": "String!"
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
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "PreviewFeedResultQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "FeedPreview",
        "kind": "LinkedField",
        "name": "feedPreview",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "PreviewFeedContent_feed"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PreviewFeedResultQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "FeedPreview",
        "kind": "LinkedField",
        "name": "feedPreview",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "url",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "title",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "TweetPreview",
            "kind": "LinkedField",
            "name": "tweets",
            "plural": true,
            "selections": [
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
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "mediaURLs",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "postedTweetID",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "action",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "retweetID",
                "storageKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "id",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "status",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "postAfter",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "postedAt",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "postedRetweetID",
                    "storageKey": null
                  }
                ],
                "type": "TweetGroup"
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "PreviewFeedResultQuery",
    "operationKind": "query",
    "text": "query PreviewFeedResultQuery(\n  $url: String!\n) {\n  feedPreview(url: $url) {\n    ...PreviewFeedContent_feed\n  }\n}\n\nfragment EditTweetForm_tweet on TweetGroup {\n  id\n  tweets {\n    body\n    mediaURLs\n  }\n}\n\nfragment PreviewFeedContent_feed on FeedPreview {\n  url\n  title\n  tweets {\n    ...TweetCard_tweet\n  }\n}\n\nfragment TweetCard_tweet on TweetContent {\n  ...EditTweetForm_tweet\n  ...ViewTweetGroup_tweet\n  ... on TweetGroup {\n    status\n  }\n}\n\nfragment ViewTweetGroup_tweet on TweetContent {\n  tweets {\n    ...ViewTweet_tweet\n    body\n    mediaURLs\n    postedTweetID\n  }\n  action\n  retweetID\n  ... on TweetGroup {\n    id\n    status\n    postAfter\n    postedAt\n    postedRetweetID\n  }\n}\n\nfragment ViewTweet_tweet on Tweet {\n  body\n  mediaURLs\n}\n"
  }
};
})();
(node as any).hash = 'b70e1915a073e6440ef652a3758524ff';
export default node;
