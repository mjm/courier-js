/* tslint:disable */
/* @relayHash 5a7952b8e9b892844178f46954cb528f */

import { ConcreteRequest } from "relay-runtime";
export type FeedInfoCardEndpointsQueryVariables = {
    url: string;
};
export type FeedInfoCardEndpointsQueryResponse = {
    readonly microformats: {
        readonly authorizationEndpoint: string | null;
        readonly tokenEndpoint: string | null;
    } | null;
};
export type FeedInfoCardEndpointsQuery = {
    readonly response: FeedInfoCardEndpointsQueryResponse;
    readonly variables: FeedInfoCardEndpointsQueryVariables;
};



/*
query FeedInfoCardEndpointsQuery(
  $url: String!
) {
  microformats(url: $url) {
    authorizationEndpoint
    tokenEndpoint
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
    "kind": "LinkedField",
    "alias": null,
    "name": "microformats",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "url",
        "variableName": "url"
      }
    ],
    "concreteType": "MicroformatPage",
    "plural": false,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "authorizationEndpoint",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "tokenEndpoint",
        "args": null,
        "storageKey": null
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "FeedInfoCardEndpointsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "FeedInfoCardEndpointsQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "FeedInfoCardEndpointsQuery",
    "id": null,
    "text": "query FeedInfoCardEndpointsQuery(\n  $url: String!\n) {\n  microformats(url: $url) {\n    authorizationEndpoint\n    tokenEndpoint\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '87883359ff02a18789971f7c51a7e8b1';
export default node;
