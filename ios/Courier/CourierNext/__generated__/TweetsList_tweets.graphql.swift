import Relay

struct TweetsList_tweets: Fragment {
    var node: ReaderFragment {
        return ReaderFragment(
            name: "TweetsList_tweets",
            selections: [
                .field(ReaderLinkedField(
                    name: "__TweetsList_allTweets_connection",
                    alias: "allTweets",
                    args: [
                        VariableArgument(name: "filter", variableName: "filter"),
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
                                        )),
                                    ]
                                )),
                                .field(ReaderScalarField(
                                    name: "cursor"
                                )),
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
                                )),
                            ]
                        )),
                    ]
                )),
            ]
        )
    }

    func getFragmentPointer(_ key: TweetsList_tweets_Key) -> FragmentPointer {
        return key.fragment_TweetsList_tweets
    }

    struct Data: Readable {
        var allTweets: TweetGroupConnection_allTweets

        init(from data: SelectorData) {
            allTweets = data.get(TweetGroupConnection_allTweets.self, "allTweets")
        }

        struct TweetGroupConnection_allTweets: Readable {
            var edges: [TweetGroupEdge_edges]
            var pageInfo: PageInfo_pageInfo

            init(from data: SelectorData) {
                edges = data.get([TweetGroupEdge_edges].self, "edges")
                pageInfo = data.get(PageInfo_pageInfo.self, "pageInfo")
            }

            struct TweetGroupEdge_edges: Readable {
                var node: TweetGroup_node
                var cursor: Cursor

                init(from data: SelectorData) {
                    node = data.get(TweetGroup_node.self, "node")
                    cursor = data.get(Cursor.self, "cursor")
                }

                struct TweetGroup_node: Readable, TweetRow_tweetGroup_Key {
                    var id: String
                    var __typename: String
                    var fragment_TweetRow_tweetGroup: FragmentPointer

                    init(from data: SelectorData) {
                        id = data.get(String.self, "id")
                        __typename = data.get(String.self, "__typename")
                        fragment_TweetRow_tweetGroup = data.get(fragment: "TweetRow_tweetGroup")
                    }

                }
            }
            struct PageInfo_pageInfo: Readable {
                var endCursor: Cursor?
                var hasNextPage: Bool

                init(from data: SelectorData) {
                    endCursor = data.get(Cursor?.self, "endCursor")
                    hasNextPage = data.get(Bool.self, "hasNextPage")
                }

            }
        }
    }
}

extension TweetsList_tweets: PaginationFragment {
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

protocol TweetsList_tweets_Key {
    var fragment_TweetsList_tweets: FragmentPointer { get }
}

