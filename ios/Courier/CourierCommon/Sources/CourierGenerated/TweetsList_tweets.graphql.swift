// Auto-generated by relay-compiler. Do not edit.

import Relay

public struct TweetsList_tweets {
    public var fragmentPointer: FragmentPointer

    public init(key: TweetsList_tweets_Key) {
        fragmentPointer = key.fragment_TweetsList_tweets
    }

    public static var node: ReaderFragment {
        ReaderFragment(
            name: "TweetsList_tweets",
            type: "Viewer",
            selections: [
                .field(ReaderLinkedField(
                    name: "__TweetsList_allTweets_connection",
                    alias: "allTweets",
                    args: [
                        VariableArgument(name: "filter", variableName: "filter")
                    ],
                    concreteType: "TweetGroupConnection",
                    plural: false,
                    selections: [
                        .field(ReaderLinkedField(
                            name: "edges",
                            concreteType: "TweetGroupEdge",
                            plural: true,
                            selections: [
                                .field(ReaderLinkedField(
                                    name: "node",
                                    concreteType: "TweetGroup",
                                    plural: false,
                                    selections: [
                                        .field(ReaderScalarField(
                                            name: "id"
                                        )),
                                        .field(ReaderScalarField(
                                            name: "__typename"
                                        )),
                                        .fragmentSpread(ReaderFragmentSpread(
                                            name: "TweetRow_tweetGroup"
                                        ))
                                    ]
                                )),
                                .field(ReaderScalarField(
                                    name: "cursor"
                                ))
                            ]
                        )),
                        .field(ReaderLinkedField(
                            name: "pageInfo",
                            concreteType: "PageInfo",
                            plural: false,
                            selections: [
                                .field(ReaderScalarField(
                                    name: "endCursor"
                                )),
                                .field(ReaderScalarField(
                                    name: "hasNextPage"
                                ))
                            ]
                        ))
                    ]
                ))
            ]
        )
    }
}

extension TweetsList_tweets {
    public struct Data: Decodable {
        public var allTweets: TweetGroupConnection_allTweets

        public struct TweetGroupConnection_allTweets: Decodable, ConnectionCollection {
            public var edges: [TweetGroupEdge_edges]

            public struct TweetGroupEdge_edges: Decodable, ConnectionEdge {
                public var node: TweetGroup_node

                public struct TweetGroup_node: Decodable, Identifiable, TweetRow_tweetGroup_Key, ConnectionNode {
                    public var id: String
                    public var fragment_TweetRow_tweetGroup: FragmentPointer
                }
            }
        }
    }
}

public protocol TweetsList_tweets_Key {
    var fragment_TweetsList_tweets: FragmentPointer { get }
}

extension TweetsList_tweets: Relay.Fragment {}

extension TweetsList_tweets: Relay.PaginationFragment {
    public typealias Operation = TweetsListPaginationQuery
    public static var metadata: Metadata {
        RefetchMetadata(
            path: ["viewer"],
            operation: Operation.self,
            connection: ConnectionMetadata(
                path: ["allTweets"],
                forward: ConnectionVariableConfig(count: "count", cursor: "cursor")
            )
        )
    }
}

#if canImport(RelaySwiftUI)
import RelaySwiftUI

extension TweetsList_tweets_Key {
    public func asFragment() -> RelaySwiftUI.Fragment<TweetsList_tweets> {
        RelaySwiftUI.Fragment<TweetsList_tweets>(self)
    }

    public func asFragment() -> RelaySwiftUI.RefetchableFragment<TweetsList_tweets> {
        RelaySwiftUI.RefetchableFragment<TweetsList_tweets>(self)
    }

    public func asFragment() -> RelaySwiftUI.PaginationFragment<TweetsList_tweets> {
        RelaySwiftUI.PaginationFragment<TweetsList_tweets>(self)
    }
}
#endif