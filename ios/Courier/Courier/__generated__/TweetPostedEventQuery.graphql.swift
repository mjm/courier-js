// Auto-generated by relay-compiler. Do not edit.

import Relay

struct TweetPostedEventQuery {
    var variables: Variables

    init(variables: Variables) {
        self.variables = variables
    }

    static var node: ConcreteRequest {
        ConcreteRequest(
            fragment: ReaderFragment(
                name: "TweetPostedEventQuery",
                type: "Query",
                selections: [
                    .field(ReaderLinkedField(
                        name: "tweetGroup",
                        args: [
                            VariableArgument(name: "id", variableName: "id")
                        ],
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
                                    )),
                                    .field(ReaderScalarField(
                                        name: "postedTweetID"
                                    ))
                                ]
                            )),
                            .field(ReaderScalarField(
                                name: "status"
                            )),
                            .field(ReaderScalarField(
                                name: "postedAt"
                            )),
                            .field(ReaderScalarField(
                                name: "postAfter"
                            ))
                        ]
                    ))
                ]),
            operation: NormalizationOperation(
                name: "TweetPostedEventQuery",
                selections: [
                    .field(NormalizationLinkedField(
                        name: "tweetGroup",
                        args: [
                            VariableArgument(name: "id", variableName: "id")
                        ],
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
                                    )),
                                    .field(NormalizationScalarField(
                                        name: "postedTweetID"
                                    ))
                                ]
                            )),
                            .field(NormalizationScalarField(
                                name: "status"
                            )),
                            .field(NormalizationScalarField(
                                name: "postedAt"
                            )),
                            .field(NormalizationScalarField(
                                name: "postAfter"
                            ))
                        ]
                    ))
                ]),
            params: RequestParameters(
                name: "TweetPostedEventQuery",
                operationKind: .query,
                text: """
query TweetPostedEventQuery(
  $id: ID!
) {
  tweetGroup(id: $id) {
    id
    tweets {
      body
      mediaURLs
      postedTweetID
    }
    status
    postedAt
    postAfter
  }
}
"""))
    }
}


extension TweetPostedEventQuery {
    struct Variables: VariableDataConvertible {
        var id: String

        var variableData: VariableData {
            [
                "id": id,
            ]
        }
    }

    init(id: String) {
        self.init(variables: .init(id: id))
    }
}

#if canImport(RelaySwiftUI)

import RelaySwiftUI

@available(iOS 14.0, macOS 10.16, tvOS 14.0, watchOS 7.0, *)
extension RelaySwiftUI.QueryNext.WrappedValue where O == TweetPostedEventQuery {
    func get(id: String, fetchKey: Any? = nil) -> RelaySwiftUI.QueryNext<TweetPostedEventQuery>.Result {
        self.get(.init(id: id), fetchKey: fetchKey)
    }
}

#endif

extension TweetPostedEventQuery {
    struct Data: Decodable {
        var tweetGroup: TweetGroup_tweetGroup?

        struct TweetGroup_tweetGroup: Decodable, Identifiable {
            var id: String
            var tweets: [Tweet_tweets]
            var status: TweetStatus
            var postedAt: String?
            var postAfter: String?

            struct Tweet_tweets: Decodable {
                var body: String
                var mediaURLs: [String]
                var postedTweetID: String?
            }
        }
    }
}

extension TweetPostedEventQuery: Relay.Operation {}
