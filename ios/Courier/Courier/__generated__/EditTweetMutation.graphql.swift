// Auto-generated by relay-compiler. Do not edit.

import Relay

struct EditTweetMutation {
    var variables: Variables

    init(variables: Variables) {
        self.variables = variables
    }

    static var node: ConcreteRequest {
        ConcreteRequest(
            fragment: ReaderFragment(
                name: "EditTweetMutation",
                type: "Mutation",
                selections: [
                    .field(ReaderLinkedField(
                        name: "editTweet",
                        args: [
                            VariableArgument(name: "input", variableName: "input")
                        ],
                        concreteType: "EditTweetPayload",
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
                                    .field(ReaderLinkedField(
                                        name: "tweets",
                                        concreteType: "Tweet",
                                        plural: true,
                                        selections: [
                                            .field(ReaderScalarField(
                                                name: "body"
                                            )),
                                            .field(ReaderScalarField(
                                                name: "mediaURLs"
                                            ))
                                        ]
                                    ))
                                ]
                            ))
                        ]
                    ))
                ]),
            operation: NormalizationOperation(
                name: "EditTweetMutation",
                selections: [
                    .field(NormalizationLinkedField(
                        name: "editTweet",
                        args: [
                            VariableArgument(name: "input", variableName: "input")
                        ],
                        concreteType: "EditTweetPayload",
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
                                    ))
                                ]
                            ))
                        ]
                    ))
                ]),
            params: RequestParameters(
                name: "EditTweetMutation",
                operationKind: .mutation,
                text: """
mutation EditTweetMutation(
  $input: EditTweetInput!
) {
  editTweet(input: $input) {
    tweetGroup {
      id
      tweets {
        body
        mediaURLs
      }
    }
  }
}
"""))
    }
}


extension EditTweetMutation {
    struct Variables: VariableDataConvertible {
        var input: EditTweetInput

        var variableData: VariableData {
            [
                "input": input,
            ]
        }
    }

    init(input: EditTweetInput) {
        self.init(variables: .init(input: input))
    }
}

#if canImport(RelaySwiftUI)

import RelaySwiftUI

@available(iOS 14.0, macOS 10.16, tvOS 14.0, watchOS 7.0, *)
extension RelaySwiftUI.QueryNext.WrappedValue where O == EditTweetMutation {
    func get(input: EditTweetInput, fetchKey: Any? = nil) -> RelaySwiftUI.QueryNext<EditTweetMutation>.Result {
        self.get(.init(input: input), fetchKey: fetchKey)
    }
}

#endif

struct EditTweetInput: VariableDataConvertible {
    var id: String
    var tweets: [TweetEdit]

    var variableData: VariableData {
        [
            "id": id,
            "tweets": tweets,
        ]
    }
}

struct TweetEdit: VariableDataConvertible {
    var body: String
    var mediaURLs: [String]?

    var variableData: VariableData {
        [
            "body": body,
            "mediaURLs": mediaURLs,
        ]
    }
}

extension EditTweetMutation {
    struct Data: Decodable {
        var editTweet: EditTweetPayload_editTweet

        struct EditTweetPayload_editTweet: Decodable {
            var tweetGroup: TweetGroup_tweetGroup

            struct TweetGroup_tweetGroup: Decodable, Identifiable {
                var id: String
                var tweets: [Tweet_tweets]

                struct Tweet_tweets: Decodable {
                    var body: String
                    var mediaURLs: [String]
                }
            }
        }
    }
}

extension EditTweetMutation: Relay.Operation {}
