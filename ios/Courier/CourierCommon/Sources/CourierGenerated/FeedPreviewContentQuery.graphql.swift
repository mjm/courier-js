// Auto-generated by relay-compiler. Do not edit.

import Relay

public struct FeedPreviewContentQuery {
    public var variables: Variables

    public init(variables: Variables) {
        self.variables = variables
    }

    public static var node: ConcreteRequest {
        ConcreteRequest(
            fragment: ReaderFragment(
                name: "FeedPreviewContentQuery",
                type: "Query",
                selections: [
                    .field(ReaderLinkedField(
                        name: "feedPreview",
                        args: [
                            VariableArgument(name: "url", variableName: "url")
                        ],
                        concreteType: "FeedPreview",
                        plural: false,
                        selections: [
                            .field(ReaderScalarField(
                                name: "url"
                            )),
                            .field(ReaderScalarField(
                                name: "title"
                            )),
                            .field(ReaderLinkedField(
                                name: "tweets",
                                concreteType: "TweetPreview",
                                plural: true,
                                selections: [
                                    .fragmentSpread(ReaderFragmentSpread(
                                        name: "TweetRow_tweetGroup"
                                    ))
                                ]
                            ))
                        ]
                    ))
                ]
            ),
            operation: NormalizationOperation(
                name: "FeedPreviewContentQuery",
                selections: [
                    .field(NormalizationLinkedField(
                        name: "feedPreview",
                        args: [
                            VariableArgument(name: "url", variableName: "url")
                        ],
                        concreteType: "FeedPreview",
                        plural: false,
                        selections: [
                            .field(NormalizationScalarField(
                                name: "url"
                            )),
                            .field(NormalizationScalarField(
                                name: "title"
                            )),
                            .field(NormalizationLinkedField(
                                name: "tweets",
                                concreteType: "TweetPreview",
                                plural: true,
                                selections: [
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
                                    )),
                                    .inlineFragment(NormalizationInlineFragment(
                                        type: "TweetGroup",
                                        selections: [
                                            .field(NormalizationScalarField(
                                                name: "id"
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
                            ))
                        ]
                    ))
                ]
            ),
            params: RequestParameters(
                name: "FeedPreviewContentQuery",
                operationKind: .query,
                text: """
query FeedPreviewContentQuery(
  $url: String!
) {
  feedPreview(url: $url) {
    url
    title
    tweets {
      ...TweetRow_tweetGroup
    }
  }
}

fragment TweetRow_tweetGroup on TweetContent {
  tweets {
    body
    mediaURLs
  }
  ... on TweetGroup {
    id
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

extension FeedPreviewContentQuery {
    public struct Variables: VariableDataConvertible {
        public var url: String

        public init(url: String) {
            self.url = url
        }

        public var variableData: VariableData {
            [
                "url": url
            ]
        }
    }

    public init(url: String) {
        self.init(variables: .init(url: url))
    }
}

#if swift(>=5.3) && canImport(RelaySwiftUI)
import RelaySwiftUI

@available(iOS 14.0, macOS 10.16, tvOS 14.0, watchOS 7.0, *)
extension RelaySwiftUI.QueryNext.WrappedValue where O == FeedPreviewContentQuery {
    public func get(url: String, fetchKey: Any? = nil) -> RelaySwiftUI.QueryNext<FeedPreviewContentQuery>.Result {
        self.get(.init(url: url), fetchKey: fetchKey)
    }
}
#endif

#if swift(>=5.3) && canImport(RelaySwiftUI)
import RelaySwiftUI

@available(iOS 14.0, macOS 10.16, tvOS 14.0, watchOS 7.0, *)
extension RelaySwiftUI.RefetchableFragment.Wrapper where F.Operation == FeedPreviewContentQuery {
    public func refetch(url: String) {
        self.refetch(.init(url: url))
    }
}
#endif

extension FeedPreviewContentQuery {
    public struct Data: Decodable {
        public var feedPreview: FeedPreview_feedPreview?

        public struct FeedPreview_feedPreview: Decodable {
            public var url: String
            public var title: String
            public var tweets: [TweetPreview_tweets]

            public struct TweetPreview_tweets: Decodable, TweetRow_tweetGroup_Key {
                public var fragment_TweetRow_tweetGroup: FragmentPointer
            }
        }
    }
}

extension FeedPreviewContentQuery: Relay.Operation {}