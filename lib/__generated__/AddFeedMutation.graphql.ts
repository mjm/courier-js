/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AddFeedInput = {
    url: string;
};
export type AddFeedMutationVariables = {
    input: AddFeedInput;
};
export type AddFeedMutationResponse = {
    readonly addFeed: {
        readonly feed: {
            readonly id: string;
        };
        readonly feedEdge: {
            readonly node: {
                readonly " $fragmentRefs": FragmentRefs<"FeedCard_feed">;
            };
            readonly cursor: unknown;
        };
    };
};
export type AddFeedMutation = {
    readonly response: AddFeedMutationResponse;
    readonly variables: AddFeedMutationVariables;
};



/*
mutation AddFeedMutation(
  $input: AddFeedInput!
) {
  addFeed(input: $input) {
    feed {
      id
    }
    feedEdge {
      node {
        ...FeedCard_feed
        id
      }
      cursor
    }
  }
}

fragment FeedCard_feed on Feed {
  id
  title
  homePageURL
  refreshedAt
  autopost
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input",
    "type": "AddFeedInput!"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "concreteType": "Feed",
  "kind": "LinkedField",
  "name": "feed",
  "plural": false,
  "selections": [
    (v2/*: any*/)
  ],
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AddFeedMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "AddFeedPayload",
        "kind": "LinkedField",
        "name": "addFeed",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "FeedEdge",
            "kind": "LinkedField",
            "name": "feedEdge",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Feed",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "FeedCard_feed"
                  }
                ],
                "storageKey": null
              },
              (v4/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AddFeedMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "AddFeedPayload",
        "kind": "LinkedField",
        "name": "addFeed",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "FeedEdge",
            "kind": "LinkedField",
            "name": "feedEdge",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Feed",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
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
                    "kind": "ScalarField",
                    "name": "homePageURL",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "refreshedAt",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "autopost",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              (v4/*: any*/)
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
    "name": "AddFeedMutation",
    "operationKind": "mutation",
    "text": "mutation AddFeedMutation(\n  $input: AddFeedInput!\n) {\n  addFeed(input: $input) {\n    feed {\n      id\n    }\n    feedEdge {\n      node {\n        ...FeedCard_feed\n        id\n      }\n      cursor\n    }\n  }\n}\n\nfragment FeedCard_feed on Feed {\n  id\n  title\n  homePageURL\n  refreshedAt\n  autopost\n}\n"
  }
};
})();
(node as any).hash = 'c1d6293c5de37bf3c544230b8dd2d1af';
export default node;
