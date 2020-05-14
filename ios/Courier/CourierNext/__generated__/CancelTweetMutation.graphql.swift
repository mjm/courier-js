// Auto-generated by relay-compiler. Do not edit.

import Relay

struct CancelTweetMutation {
    var node: ConcreteRequest {
        ConcreteRequest(
            fragment: ReaderFragment(
                name: "CancelTweetMutation",
                selections: [
                    .field(ReaderLinkedField(
                        name: "cancelTweet",
                        args: [
                            VariableArgument(name: "input", variableName: "input")
                        ],
                        concreteType: "CancelTweetPayload",
                        plural: false,
                        selections: [
                            .field(ReaderLinkedField(
                                name: "tweetGroup",
                                concreteType: "TweetGroup",
                                plural: false,
                                selections: [
                                    .field(ReaderScalarField(
                                        name: "id"
                                    )),
                                    .field(ReaderScalarField(
                                        name: "status"
                                    ))
                                ]
                            ))
                        ]
                    ))
                ]),
            operation: NormalizationOperation(
                name: "CancelTweetMutation",
                selections: [
                    .field(NormalizationLinkedField(
                        name: "cancelTweet",
                        args: [
                            VariableArgument(name: "input", variableName: "input")
                        ],
                        concreteType: "CancelTweetPayload",
                        plural: false,
                        selections: [
                            .field(NormalizationLinkedField(
                                name: "tweetGroup",
                                concreteType: "TweetGroup",
                                plural: false,
                                selections: [
                                    .field(NormalizationScalarField(
                                        name: "id"
                                    )),
                                    .field(NormalizationScalarField(
                                        name: "status"
                                    ))
                                ]
                            ))
                        ]
                    ))
                ]),
            params: RequestParameters(
                name: "CancelTweetMutation",
                operationKind: .mutation,
                text: """
mutation CancelTweetMutation(
  $input: CancelTweetInput!
) {
  cancelTweet(input: $input) {
    tweetGroup {
      id
      status
    }
  }
}
"""))
    }
}


extension CancelTweetMutation {
    struct Variables: VariableDataConvertible {
        var input: CancelTweetInput

        var variableData: VariableData {
            [
                "input": input,
            ]
        }
    }
}

struct CancelTweetInput: VariableDataConvertible {
    var id: String

    var variableData: VariableData {
        [
            "id": id,
        ]
    }
}

extension CancelTweetMutation {
    struct Data: Readable {
        var cancelTweet: CancelTweetPayload_cancelTweet

        init(from data: SelectorData) {
            cancelTweet = data.get(CancelTweetPayload_cancelTweet.self, "cancelTweet")
        }

        struct CancelTweetPayload_cancelTweet: Readable {
            var tweetGroup: TweetGroup_tweetGroup

            init(from data: SelectorData) {
                tweetGroup = data.get(TweetGroup_tweetGroup.self, "tweetGroup")
            }

            struct TweetGroup_tweetGroup: Readable {
                var id: String
                var status: TweetStatus

                init(from data: SelectorData) {
                    id = data.get(String.self, "id")
                    status = data.get(TweetStatus.self, "status")
                }
            }
        }
    }
}

extension CancelTweetMutation: Relay.Operation {}
