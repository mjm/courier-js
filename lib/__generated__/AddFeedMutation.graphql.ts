/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AddFeedInput = {
    readonly url: string;
};
export type AddFeedMutationVariables = {
    input: AddFeedInput;
};
export type AddFeedMutationResponse = {
    readonly addFeed: {
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
    feedEdge {
      node {
        ...FeedCard_feed
        id
      }
      cursor
    }
  }
}

fragment FeedCard_feed on SubscribedFeed {
  id
  feed {
    id
    url
    title
    homePageURL
    micropubEndpoint
    refreshedAt
  }
  autopost
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "AddFeedInput!",
    "defaultValue": null
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
  "kind": "ScalarField",
  "alias": null,
  "name": "cursor",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "AddFeedMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "addFeed",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "AddFeedPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "feedEdge",
            "storageKey": null,
            "args": null,
            "concreteType": "SubscribedFeedEdge",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "node",
                "storageKey": null,
                "args": null,
                "concreteType": "SubscribedFeed",
                "plural": false,
                "selections": [
                  {
                    "kind": "FragmentSpread",
                    "name": "FeedCard_feed",
                    "args": null
                  }
                ]
              },
              (v2/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "AddFeedMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "addFeed",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "AddFeedPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "feedEdge",
            "storageKey": null,
            "args": null,
            "concreteType": "SubscribedFeedEdge",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "node",
                "storageKey": null,
                "args": null,
                "concreteType": "SubscribedFeed",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "feed",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Feed",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/),
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
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "homePageURL",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "micropubEndpoint",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "refreshedAt",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "autopost",
                    "args": null,
                    "storageKey": null
                  }
                ]
              },
              (v2/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "mutation",
    "name": "AddFeedMutation",
    "id": null,
    "text": "mutation AddFeedMutation(\n  $input: AddFeedInput!\n) {\n  addFeed(input: $input) {\n    feedEdge {\n      node {\n        ...FeedCard_feed\n        id\n      }\n      cursor\n    }\n  }\n}\n\nfragment FeedCard_feed on SubscribedFeed {\n  id\n  feed {\n    id\n    url\n    title\n    homePageURL\n    micropubEndpoint\n    refreshedAt\n  }\n  autopost\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'a611ebbe38b6cfca200cc4fd0688c655';
export default node;
