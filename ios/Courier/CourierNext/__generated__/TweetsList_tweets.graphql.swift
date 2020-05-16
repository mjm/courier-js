// Auto-generated by relay-compiler. Do not edit.

import Relay

struct TweetsList_tweets {
    var node: ReaderFragment {
        ReaderFragment(
            name: "TweetsList_tweets",
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
            ])
    }
}


extension TweetsList_tweets {
    struct Data: Readable {
        var allTweets: TweetGroupConnection_allTweets

        init(from data: SelectorData) {
            allTweets = data.get(TweetGroupConnection_allTweets.self, "allTweets")
        }

        struct TweetGroupConnection_allTweets: Readable {
            var edges: [TweetGroupEdge_edges]

            init(from data: SelectorData) {
                edges = data.get([TweetGroupEdge_edges].self, "edges")
            }

            struct TweetGroupEdge_edges: Readable {
                var node: TweetGroup_node

                init(from data: SelectorData) {
                    node = data.get(TweetGroup_node.self, "node")
                }

                struct TweetGroup_node: Readable, TweetRow_tweetGroup_Key {
                    var id: String
                    var fragment_TweetRow_tweetGroup: FragmentPointer

                    init(from data: SelectorData) {
                        id = data.get(String.self, "id")
                        fragment_TweetRow_tweetGroup = data.get(fragment: "TweetRow_tweetGroup")
                    }
                }
            }
        }
    }
}

protocol TweetsList_tweets_Key {
    var fragment_TweetsList_tweets: FragmentPointer { get }
}

extension TweetsList_tweets {
    func getFragmentPointer(_ key: TweetsList_tweets_Key) -> FragmentPointer {
        key.fragment_TweetsList_tweets
    }
}

extension TweetsList_tweets: Relay.Fragment {}

extension TweetsList_tweets: Relay.PaginationFragment {
    typealias Operation = TweetsListPaginationQuery

    var metadata: Metadata {
        RefetchMetadata(
            path: ["viewer"],
            operation: .init(),
            connection: ConnectionMetadata(
                path: ["allTweets"],
                forward: ConnectionVariableConfig(count: "count", cursor: "cursor")))
    }
}