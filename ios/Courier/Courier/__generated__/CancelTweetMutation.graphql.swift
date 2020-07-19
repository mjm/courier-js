// Auto-generated by relay-compiler. Do not edit.

import Relay

struct CancelTweetMutation {
    var variables: Variables

    init(variables: Variables) {
        self.variables = variables
    }

    static var node: ConcreteRequest {
        ConcreteRequest(
            fragment: ReaderFragment(
                name: "CancelTweetMutation",
                type: "Mutation",
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
                ]
            ),
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
                ]
            ),
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
"""
            )
        )
    }
}

extension CancelTweetMutation {
    struct Variables: VariableDataConvertible {
        var input: CancelTweetInput

        var variableData: VariableData {
            [
                "input": input
            ]
        }
    }

    init(input: CancelTweetInput) {
        self.init(variables: .init(input: input))
    }
}

#if swift(>=5.3) && canImport(RelaySwiftUI)
import RelaySwiftUI

@available(iOS 14.0, macOS 10.16, tvOS 14.0, watchOS 7.0, *)
extension RelaySwiftUI.QueryNext.WrappedValue where O == CancelTweetMutation {
    func get(input: CancelTweetInput, fetchKey: Any? = nil) -> RelaySwiftUI.QueryNext<CancelTweetMutation>.Result {
        self.get(.init(input: input), fetchKey: fetchKey)
    }
}
#endif

struct CancelTweetInput: VariableDataConvertible {
    var id: String

    var variableData: VariableData {
        [
            "id": id
        ]
    }
}


extension CancelTweetMutation {
    struct Data: Decodable {
        var cancelTweet: CancelTweetPayload_cancelTweet

        struct CancelTweetPayload_cancelTweet: Decodable {
            var tweetGroup: TweetGroup_tweetGroup

            struct TweetGroup_tweetGroup: Decodable, Identifiable {
                var id: String
                var status: TweetStatus
            }
        }
    }
}

extension CancelTweetMutation: Relay.Operation {}