import Relay

struct TweetDetailScreenQuery: Operation {
    var node: ConcreteRequest {
        return ConcreteRequest(
            fragment: ReaderFragment(
                name: "TweetDetailScreenQuery",
                selections: [
                    .field(ReaderLinkedField(
                        name: "tweetGroup",
                        args: [
                            VariableArgument(name: "id", variableName: "id"),
                        ],
                        concreteType: "TweetGroup",
                        plural: false,
                        selections: [
                            .field(ReaderScalarField(
                                name: "id"
                            )),
                            .field(ReaderScalarField(
                                name: "status"
                            )),
                            .field(ReaderScalarField(
                                name: "action"
                            )),
                            .fragmentSpread(ReaderFragmentSpread(
                                name: "DetailedTweetList_tweetGroup"
                            )),
                        ]
                    )),
                ]
            ),
            operation: NormalizationOperation(
                name: "TweetDetailScreenQuery",
                selections: [
                    .field(NormalizationLinkedField(
                        name: "tweetGroup",
                        args: [
                            VariableArgument(name: "id", variableName: "id"),
                        ],
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
                                name: "action"
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
                                    )),
                                ]
                            )),
                        ]
                    )),
                ]
            ),
            params: RequestParameters(
                name: "TweetDetailScreenQuery",
                operationKind: .query,
                text: """
query TweetDetailScreenQuery(
  $id: ID!
) {
  tweetGroup(id: $id) {
    id
    status
    action
    ...DetailedTweetList_tweetGroup
  }
}

fragment DetailedTweetList_tweetGroup on TweetGroup {
  tweets {
    body
    ...DetailedTweetRow_tweet
  }
}

fragment DetailedTweetRow_tweet on Tweet {
  body
  mediaURLs
}
"""
            )
        )
    }

    struct Variables: VariableDataConvertible {
        var id: String?

        var variableData: VariableData {
            [
                "id": id,
            ]
        }
    }

    struct Data: Readable {
        var tweetGroup: TweetGroup_tweetGroup?

        init(from data: SelectorData) {
            tweetGroup = data.get(TweetGroup_tweetGroup?.self, "tweetGroup")
        }

        struct TweetGroup_tweetGroup: Readable, DetailedTweetList_tweetGroup_Key {
            var id: String
            var status: TweetStatus
            var action: TweetAction
            var fragment_DetailedTweetList_tweetGroup: FragmentPointer

            init(from data: SelectorData) {
                id = data.get(String.self, "id")
                status = data.get(TweetStatus.self, "status")
                action = data.get(TweetAction.self, "action")
                fragment_DetailedTweetList_tweetGroup = data.get(fragment: "DetailedTweetList_tweetGroup")
            }

        }
    }
}

enum TweetAction: String, Hashable, VariableValueConvertible, ReadableScalar, CustomStringConvertible {
    case tweet = "TWEET"
    case retweet = "RETWEET"

    var description: String {
        rawValue
    }
}

enum TweetStatus: String, Hashable, VariableValueConvertible, ReadableScalar, CustomStringConvertible {
    case draft = "DRAFT"
    case canceled = "CANCELED"
    case posted = "POSTED"

    var description: String {
        rawValue
    }
}

typealias Time = String
typealias Cursor = String
