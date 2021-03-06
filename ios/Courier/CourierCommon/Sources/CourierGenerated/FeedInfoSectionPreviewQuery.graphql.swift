// Auto-generated by relay-compiler. Do not edit.

import Relay

public struct FeedInfoSectionPreviewQuery {
    public var variables: Variables

    public init(variables: Variables) {
        self.variables = variables
    }

    public static var node: ConcreteRequest {
        ConcreteRequest(
            fragment: ReaderFragment(
                name: "FeedInfoSectionPreviewQuery",
                type: "Query",
                selections: [
                    .field(ReaderLinkedField(
                        name: "feed",
                        alias: "feed1",
                        storageKey: "feed(id:\"1\")",
                        args: [
                            LiteralArgument(name: "id", value: "1")
                        ],
                        concreteType: "Feed",
                        plural: false,
                        selections: [
                            .fragmentSpread(ReaderFragmentSpread(
                                name: "FeedInfoSection_feed"
                            ))
                        ]
                    )),
                    .field(ReaderLinkedField(
                        name: "feed",
                        alias: "feed2",
                        storageKey: "feed(id:\"2\")",
                        args: [
                            LiteralArgument(name: "id", value: "2")
                        ],
                        concreteType: "Feed",
                        plural: false,
                        selections: [
                            .fragmentSpread(ReaderFragmentSpread(
                                name: "FeedInfoSection_feed"
                            ))
                        ]
                    ))
                ]
            ),
            operation: NormalizationOperation(
                name: "FeedInfoSectionPreviewQuery",
                selections: [
                    .field(NormalizationLinkedField(
                        name: "feed",
                        alias: "feed1",
                        args: [
                            LiteralArgument(name: "id", value: "1")
                        ],
                        storageKey: "feed(id:\"1\")",
                        concreteType: "Feed",
                        plural: false,
                        selections: [
                            .field(NormalizationScalarField(
                                name: "id"
                            )),
                            .field(NormalizationScalarField(
                                name: "title"
                            )),
                            .field(NormalizationScalarField(
                                name: "refreshedAt"
                            )),
                            .field(NormalizationScalarField(
                                name: "refreshing"
                            )),
                            .field(NormalizationScalarField(
                                name: "autopost"
                            ))
                        ]
                    )),
                    .field(NormalizationLinkedField(
                        name: "feed",
                        alias: "feed2",
                        args: [
                            LiteralArgument(name: "id", value: "2")
                        ],
                        storageKey: "feed(id:\"2\")",
                        concreteType: "Feed",
                        plural: false,
                        selections: [
                            .field(NormalizationScalarField(
                                name: "id"
                            )),
                            .field(NormalizationScalarField(
                                name: "title"
                            )),
                            .field(NormalizationScalarField(
                                name: "refreshedAt"
                            )),
                            .field(NormalizationScalarField(
                                name: "refreshing"
                            )),
                            .field(NormalizationScalarField(
                                name: "autopost"
                            ))
                        ]
                    ))
                ]
            ),
            params: RequestParameters(
                name: "FeedInfoSectionPreviewQuery",
                operationKind: .query,
                text: """
query FeedInfoSectionPreviewQuery {
  feed1: feed(id: "1") {
    ...FeedInfoSection_feed
    id
  }
  feed2: feed(id: "2") {
    ...FeedInfoSection_feed
    id
  }
}

fragment FeedInfoSection_feed on Feed {
  id
  title
  refreshedAt
  refreshing
  autopost
}
"""
            )
        )
    }
}

extension FeedInfoSectionPreviewQuery {
    public typealias Variables = EmptyVariables
}



extension FeedInfoSectionPreviewQuery {
    public struct Data: Decodable {
        public var feed1: Feed_feed1?
        public var feed2: Feed_feed2?

        public struct Feed_feed1: Decodable, FeedInfoSection_feed_Key {
            public var fragment_FeedInfoSection_feed: FragmentPointer
        }

        public struct Feed_feed2: Decodable, FeedInfoSection_feed_Key {
            public var fragment_FeedInfoSection_feed: FragmentPointer
        }
    }
}

extension FeedInfoSectionPreviewQuery: Relay.Operation {}