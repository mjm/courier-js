// Auto-generated by relay-compiler. Do not edit.

import Relay

public struct TweetsScreenQuery {
    public var variables: Variables

    public init(variables: Variables) {
        self.variables = variables
    }

    public static var node: ConcreteRequest {
        ConcreteRequest(
            fragment: ReaderFragment(
                name: "TweetsScreenQuery",
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
                                    VariableArgument(name: "filter", variableName: "filter")
                                ]
                            ))
                        ]
                    ))
                ]
            ),
            operation: NormalizationOperation(
                name: "TweetsScreenQuery",
                selections: [
                    .field(NormalizationLinkedField(
                        name: "viewer",
                        concreteType: "Viewer",
                        plural: false,
                        selections: [
                            .field(NormalizationLinkedField(
                                name: "allTweets",
                                args: [
                                    VariableArgument(name: "filter", variableName: "filter"),
                                    LiteralArgument(name: "first", value: 10)
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
                                    VariableArgument(name: "filter", variableName: "filter"),
                                    LiteralArgument(name: "first", value: 10)
                                ],
                                handle: "connection",
                                key: "TweetsList_allTweets",
                                filters: ["filter"]
                            ))
                        ]
                    ))
                ]
            ),
            params: RequestParameters(
                name: "TweetsScreenQuery",
                operationKind: .query,
                text: """
query TweetsScreenQuery(
  $filter: TweetFilter!
) {
  viewer {
    ...TweetsList_tweets_Vt7Yj
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

fragment TweetsList_tweets_Vt7Yj on Viewer {
  allTweets(filter: $filter, first: 10) {
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
"""
            )
        )
    }
}

extension TweetsScreenQuery {
    public struct Variables: VariableDataConvertible {
        public var filter: TweetFilter

        public init(filter: TweetFilter) {
            self.filter = filter
        }

        public var variableData: VariableData {
            [
                "filter": filter
            ]
        }
    }

    public init(filter: TweetFilter) {
        self.init(variables: .init(filter: filter))
    }
}

#if swift(>=5.3) && canImport(RelaySwiftUI)
import RelaySwiftUI

@available(iOS 14.0, macOS 10.16, tvOS 14.0, watchOS 7.0, *)
extension RelaySwiftUI.QueryNext.WrappedValue where O == TweetsScreenQuery {
    public func get(filter: TweetFilter, fetchKey: Any? = nil) -> RelaySwiftUI.QueryNext<TweetsScreenQuery>.Result {
        self.get(.init(filter: filter), fetchKey: fetchKey)
    }
}
#endif

#if swift(>=5.3) && canImport(RelaySwiftUI)
import RelaySwiftUI

@available(iOS 14.0, macOS 10.16, tvOS 14.0, watchOS 7.0, *)
extension RelaySwiftUI.RefetchableFragment.Wrapper where F.Operation == TweetsScreenQuery {
    public func refetch(filter: TweetFilter) {
        self.refetch(.init(filter: filter))
    }
}
#endif

extension TweetsScreenQuery {
    public struct Data: Decodable {
        public var viewer: Viewer_viewer?

        public struct Viewer_viewer: Decodable, TweetsList_tweets_Key {
            public var fragment_TweetsList_tweets: FragmentPointer
        }
    }
}

public enum TweetFilter: String, Decodable, Hashable, VariableValueConvertible, ReadableScalar, CustomStringConvertible {
    case upcoming = "UPCOMING"
    case past = "PAST"
    public var description: String {
        rawValue
    }
}

extension TweetsScreenQuery: Relay.Operation {}