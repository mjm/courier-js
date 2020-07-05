// Auto-generated by relay-compiler. Do not edit.

import Relay

struct UncancelTweetMutation {
    var variables: Variables

    init(variables: Variables) {
        self.variables = variables
    }

    static var node: ConcreteRequest {
        ConcreteRequest(
            fragment: ReaderFragment(
                name: "UncancelTweetMutation",
                type: "Mutation",
                selections: [
                    .field(ReaderLinkedField(
                        name: "uncancelTweet",
                        args: [
                            VariableArgument(name: "input", variableName: "input")
                        ],
                        concreteType: "UncancelTweetPayload",
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
                name: "UncancelTweetMutation",
                selections: [
                    .field(NormalizationLinkedField(
                        name: "uncancelTweet",
                        args: [
                            VariableArgument(name: "input", variableName: "input")
                        ],
                        concreteType: "UncancelTweetPayload",
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
                name: "UncancelTweetMutation",
                operationKind: .mutation,
                text: """
mutation UncancelTweetMutation(
  $input: UncancelTweetInput!
) {
  uncancelTweet(input: $input) {
    tweetGroup {
      id
      status
    }
  }
}
"""))
    }
}


extension UncancelTweetMutation {
    struct Variables: VariableDataConvertible {
        var input: UncancelTweetInput

        var variableData: VariableData {
            [
                "input": input,
            ]
        }
    }

    init(input: UncancelTweetInput) {
        self.init(variables: .init(input: input))
    }
}

#if canImport(RelaySwiftUI)

import RelaySwiftUI

@available(iOS 14.0, macOS 10.16, tvOS 14.0, watchOS 7.0, *)
extension RelaySwiftUI.QueryNext.WrappedValue where O == UncancelTweetMutation {
    func get(input: UncancelTweetInput, fetchKey: Any? = nil) -> RelaySwiftUI.QueryNext<UncancelTweetMutation>.Result {
        self.get(.init(input: input), fetchKey: fetchKey)
    }
}

#endif

struct UncancelTweetInput: VariableDataConvertible {
    var id: String

    var variableData: VariableData {
        [
            "id": id,
        ]
    }
}

extension UncancelTweetMutation {
    struct Data: Decodable {
        var uncancelTweet: UncancelTweetPayload_uncancelTweet

        struct UncancelTweetPayload_uncancelTweet: Decodable {
            var tweetGroup: TweetGroup_tweetGroup

            struct TweetGroup_tweetGroup: Decodable, Identifiable {
                var id: String
                var status: TweetStatus
            }
        }
    }
}

enum TweetStatus: String, Decodable, Hashable, VariableValueConvertible, ReadableScalar, CustomStringConvertible {
    case draft = "DRAFT"
    case canceled = "CANCELED"
    case posted = "POSTED"

    var description: String { rawValue }
}

extension UncancelTweetMutation: Relay.Operation {}
