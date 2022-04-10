// Auto-generated by relay-compiler. Do not edit.

import Relay

public struct TweetPostedEventQuery {
    public var variables: Variables

    public init(variables: Variables) {
        self.variables = variables
    }

    public static var node: ConcreteRequest {
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
                ]
            ),
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
                ]
            ),
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
"""
            )
        )
    }
}

extension TweetPostedEventQuery {
    public struct Variables: VariableDataConvertible {
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

    public init(id: String) {
        self.init(variables: .init(id: id))
    }
}

#if canImport(RelaySwiftUI)
import RelaySwiftUI

extension RelaySwiftUI.Query.WrappedValue where O == TweetPostedEventQuery {
    public func get(id: String, fetchKey: Any? = nil) -> RelaySwiftUI.Query<TweetPostedEventQuery>.Result {
        self.get(.init(id: id), fetchKey: fetchKey)
    }
}
#endif

#if canImport(RelaySwiftUI)
import RelaySwiftUI

extension RelaySwiftUI.RefetchableFragment.Wrapper where F.Operation == TweetPostedEventQuery {
    public func refetch(id: String) {
        self.refetch(.init(id: id))
    }
}
#endif

extension TweetPostedEventQuery {
    public struct Data: Decodable {
        public var tweetGroup: TweetGroup_tweetGroup?

        public struct TweetGroup_tweetGroup: Decodable, Identifiable {
            public var id: String
            public var tweets: [Tweet_tweets]
            public var status: TweetStatus
            public var postedAt: String?
            public var postAfter: String?

            public struct Tweet_tweets: Decodable {
                public var body: String
                public var mediaURLs: [String]
                public var postedTweetID: String?
            }
        }
    }
}

extension TweetPostedEventQuery: Relay.Operation {}