// Auto-generated by relay-compiler. Do not edit.

import Relay

struct TweetsListPaginationQuery {
    var variables: Variables

    init(variables: Variables) {
        self.variables = variables
    }

    static var node: ConcreteRequest {
        ConcreteRequest(
            fragment: ReaderFragment(
                name: "TweetsListPaginationQuery",
                type: "Query",
                selections: [
                    .field(ReaderLinkedField(
                        name: "viewer",
                        concreteType: "Viewer",
                        plural: false,
                        selections: [
                            .fragmentSpread(ReaderFragmentSpread(
                                name: "TweetsList_tweets",
                                args: [
                                    VariableArgument(name: "count", variableName: "count"),
                                    VariableArgument(name: "cursor", variableName: "cursor"),
                                    VariableArgument(name: "filter", variableName: "filter")
                                ]
                            ))
                        ]
                    ))
                ]),
            operation: NormalizationOperation(
                name: "TweetsListPaginationQuery",
                selections: [
                    .field(NormalizationLinkedField(
                        name: "viewer",
                        concreteType: "Viewer",
                        plural: false,
                        selections: [
                            .field(NormalizationLinkedField(
                                name: "allTweets",
                                args: [
                                    VariableArgument(name: "after", variableName: "cursor"),
                                    VariableArgument(name: "filter", variableName: "filter"),
                                    VariableArgument(name: "first", variableName: "count")
                                ],
                                concreteType: "TweetGroupConnection",
                                plural: false,
                                selections: [
                                    .field(NormalizationLinkedField(
                                        name: "edges",
                                        concreteType: "TweetGroupEdge",
                                        plural: true,
                                        selections: [
                                            .field(NormalizationLinkedField(
                                                name: "node",
                                                concreteType: "TweetGroup",
                                                plural: false,
                                                selections: [
                                                    .field(NormalizationScalarField(
                                                        name: "id"
                                                    )),
                                                    .field(NormalizationScalarField(
                                                        name: "status"
                                                    )),
                                                    .field(NormalizationScalarField(
                                                        name: "postedAt"
                                                    )),
                                                    .field(NormalizationScalarField(
                                                        name: "postAfter"
                                                    )),
                                                    .field(NormalizationLinkedField(
                                                        name: "tweets",
                                                        concreteType: "Tweet",
                                                        plural: true,
                                                        selections: [
                                                            .field(NormalizationScalarField(
                                                                name: "body"
                                                            )),
                                                            .field(NormalizationScalarField(
                                                                name: "mediaURLs"
                                                            ))
                                                        ]
                                                    )),
                                                    .field(NormalizationScalarField(
                                                        name: "__typename"
                                                    ))
                                                ]
                                            )),
                                            .field(NormalizationScalarField(
                                                name: "cursor"
                                            ))
                                        ]
                                    )),
                                    .field(NormalizationLinkedField(
                                        name: "pageInfo",
                                        concreteType: "PageInfo",
                                        plural: false,
                                        selections: [
                                            .field(NormalizationScalarField(
                                                name: "endCursor"
                                            )),
                                            .field(NormalizationScalarField(
                                                name: "hasNextPage"
                                            ))
                                        ]
                                    ))
                                ]
                            )),
                            .handle(NormalizationHandle(
                                kind: .linked,
                                name: "allTweets",
                                args: [
                                    VariableArgument(name: "after", variableName: "cursor"),
                                    VariableArgument(name: "filter", variableName: "filter"),
                                    VariableArgument(name: "first", variableName: "count")
                                ],
                                handle: "connection",
                                key: "TweetsList_allTweets",
                                filters: ["filter"]
                            ))
                        ]
                    ))
                ]),
            params: RequestParameters(
                name: "TweetsListPaginationQuery",
                operationKind: .query,
                text: """
query TweetsListPaginationQuery(
  $filter: TweetFilter
  $count: Int = 10
  $cursor: Cursor
) {
  viewer {
    ...TweetsList_tweets_3KQYpM
  }
}

fragment TweetRow_tweetGroup on TweetGroup {
  id
  status
  postedAt
  postAfter
  tweets {
    body
    mediaURLs
  }
}

fragment TweetsList_tweets_3KQYpM on Viewer {
  allTweets(filter: $filter, first: $count, after: $cursor) {
    edges {
      node {
        id
        ...TweetRow_tweetGroup
        __typename
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
"""))
    }
}


extension TweetsListPaginationQuery {
    struct Variables: VariableDataConvertible {
        var filter: TweetFilter?
        var count: Int?
        var cursor: String?

        var variableData: VariableData {
            [
                "filter": filter,
                "count": count,
                "cursor": cursor,
            ]
        }
    }

    init(filter: TweetFilter? = nil, count: Int? = nil, cursor: String? = nil) {
        self.init(variables: .init(filter: filter, count: count, cursor: cursor))
    }
}

#if swift(>=5.3) && canImport(RelaySwiftUI)

import RelaySwiftUI

@available(iOS 14.0, macOS 10.16, tvOS 14.0, watchOS 7.0, *)
extension RelaySwiftUI.QueryNext.WrappedValue where O == TweetsListPaginationQuery {
    func get(filter: TweetFilter? = nil, count: Int? = nil, cursor: String? = nil, fetchKey: Any? = nil) -> RelaySwiftUI.QueryNext<TweetsListPaginationQuery>.Result {
        self.get(.init(filter: filter, count: count, cursor: cursor), fetchKey: fetchKey)
    }
}

#endif

extension TweetsListPaginationQuery {
    struct Data: Decodable {
        var viewer: Viewer_viewer?

        struct Viewer_viewer: Decodable, TweetsList_tweets_Key {
            var fragment_TweetsList_tweets: FragmentPointer
        }
    }
}

extension TweetsListPaginationQuery: Relay.Operation {}
