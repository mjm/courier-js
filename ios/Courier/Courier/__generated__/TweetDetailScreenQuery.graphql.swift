// Auto-generated by relay-compiler. Do not edit.

import Relay

struct TweetDetailScreenQuery {
    var variables: Variables

    init(variables: Variables) {
        self.variables = variables
    }

    static var node: ConcreteRequest {
        ConcreteRequest(
            fragment: ReaderFragment(
                name: "TweetDetailScreenQuery",
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
                                        name: "__typename"
                                    ))
                                ]
                            )),
                            .fragmentSpread(ReaderFragmentSpread(
                                name: "ViewTweet_tweetGroup"
                            )),
                            .fragmentSpread(ReaderFragmentSpread(
                                name: "EditTweetForm_tweetGroup"
                            ))
                        ]
                    ))
                ]),
            operation: NormalizationOperation(
                name: "TweetDetailScreenQuery",
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
                                        name: "__typename"
                                    )),
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
                                name: "postAfter"
                            )),
                            .field(NormalizationScalarField(
                                name: "postedAt"
                            )),
                            .field(NormalizationScalarField(
                                name: "postedRetweetID"
                            ))
                        ]
                    ))
                ]),
            params: RequestParameters(
                name: "TweetDetailScreenQuery",
                operationKind: .query,
                text: """
query TweetDetailScreenQuery(
  $id: ID!
) {
  tweetGroup(id: $id) {
    id
    tweets {
      __typename
    }
    ...ViewTweet_tweetGroup
    ...EditTweetForm_tweetGroup
  }
}

fragment DetailedTweetActions_tweetGroup on TweetGroup {
  tweets {
    postedTweetID
  }
  id
  status
  postAfter
  postedAt
  postedRetweetID
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

fragment EditTweetForm_tweetGroup on TweetGroup {
  id
  tweets {
    body
    mediaURLs
  }
}

fragment ViewTweet_tweetGroup on TweetGroup {
  status
  ...DetailedTweetList_tweetGroup
  ...DetailedTweetActions_tweetGroup
}
"""))
    }
}


extension TweetDetailScreenQuery {
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
extension RelaySwiftUI.QueryNext.WrappedValue where O == TweetDetailScreenQuery {
    func get(id: String, fetchKey: Any? = nil) -> RelaySwiftUI.QueryNext<TweetDetailScreenQuery>.Result {
        self.get(.init(id: id), fetchKey: fetchKey)
    }
}

#endif

extension TweetDetailScreenQuery {
    struct Data: Decodable {
        var tweetGroup: TweetGroup_tweetGroup?

        struct TweetGroup_tweetGroup: Decodable, Identifiable, ViewTweet_tweetGroup_Key, EditTweetForm_tweetGroup_Key {
            var id: String
            var tweets: [Tweet_tweets]
            var fragment_ViewTweet_tweetGroup: FragmentPointer
            var fragment_EditTweetForm_tweetGroup: FragmentPointer

            struct Tweet_tweets: Decodable {
                var __typename: String
            }
        }
    }
}

extension TweetDetailScreenQuery: Relay.Operation {}
