/* tslint:disable */
/* eslint-disable */

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
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "url",
    "type": "String!"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "url",
        "variableName": "url"
      }
    ],
    "concreteType": "MicroformatPage",
    "kind": "LinkedField",
    "name": "microformats",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "authorizationEndpoint",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "tokenEndpoint",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "FeedInfoCardEndpointsQuery",
    "selections": (v1/*: any*/),
    "type": "Query"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "FeedInfoCardEndpointsQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "FeedInfoCardEndpointsQuery",
    "operationKind": "query",
    "text": "query FeedInfoCardEndpointsQuery(\n  $url: String!\n) {\n  microformats(url: $url) {\n    authorizationEndpoint\n    tokenEndpoint\n  }\n}\n"
  }
};
})();
(node as any).hash = '87883359ff02a18789971f7c51a7e8b1';
export default node;
