// Auto-generated by relay-compiler. Do not edit.

import Relay

public struct CancelTweetMutation {
    public var variables: Variables

    public init(variables: Variables) {
        self.variables = variables
    }

    public static var node: ConcreteRequest {
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
    public struct Variables: VariableDataConvertible {
        public var input: CancelTweetInput

        public init(input: CancelTweetInput) {
            self.input = input
        }

        public var variableData: VariableData {
            [
                "input": input
            ]
        }
    }

    public init(input: CancelTweetInput) {
        self.init(variables: .init(input: input))
    }
}

#if swift(>=5.3) && canImport(RelaySwiftUI)
import RelaySwiftUI

@available(iOS 14.0, macOS 10.16, tvOS 14.0, watchOS 7.0, *)
extension RelaySwiftUI.QueryNext.WrappedValue where O == CancelTweetMutation {
    public func get(input: CancelTweetInput, fetchKey: Any? = nil) -> RelaySwiftUI.QueryNext<CancelTweetMutation>.Result {
        self.get(.init(input: input), fetchKey: fetchKey)
    }
}
#endif

#if swift(>=5.3) && canImport(RelaySwiftUI)
import RelaySwiftUI

@available(iOS 14.0, macOS 10.16, tvOS 14.0, watchOS 7.0, *)
extension RelaySwiftUI.RefetchableFragment.Wrapper where F.Operation == CancelTweetMutation {
    public func refetch(input: CancelTweetInput) {
        self.refetch(.init(input: input))
    }
}
#endif

public struct CancelTweetInput: VariableDataConvertible {
    public var id: String

    public init(id: String) {
        self.id = id
    }

    public var variableData: VariableData {
        [
            "id": id
        ]
    }
}


extension CancelTweetMutation {
    public struct Data: Decodable {
        public var cancelTweet: CancelTweetPayload_cancelTweet

        public struct CancelTweetPayload_cancelTweet: Decodable {
            public var tweetGroup: TweetGroup_tweetGroup

            public struct TweetGroup_tweetGroup: Decodable, Identifiable {
                public var id: String
                public var status: TweetStatus
            }
        }
    }
}

extension CancelTweetMutation: Relay.Operation {}