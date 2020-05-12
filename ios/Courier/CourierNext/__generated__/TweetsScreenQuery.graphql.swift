import Relay

struct TweetsScreenQuery: Operation {
    var node: ConcreteRequest {
        return ConcreteRequest(
            fragment: ReaderFragment(
                name: "TweetsScreenQuery",
                selections: [
                    .field(ReaderLinkedField(
                        name: "viewer",
                        concreteType: "Viewer",
                        plural: false,
                        selections: [
                            .fragmentSpread(ReaderFragmentSpread(
                                name: "TweetsList_tweets",
                                args: [
                                    VariableArgument(name: "filter", variableName: "filter"),
                                ]
                            )),
                        ]
                    )),
                ]
            ),
            operation: NormalizationOperation(
                name: "TweetsScreenQuery",
                selections: [
                    .field(NormalizationLinkedField(
                        name: "viewer",
                        concreteType: "Viewer",
                        plural: false,
                        selections: [
                            .field(NormalizationLinkedField(
                                name: "allTweets",
                                args: [
                                    VariableArgument(name: "filter", variableName: "filter"),
                                    LiteralArgument(name: "first", value: 10),
                                ],
                                concreteType: "TweetGroupConnection",
                                plural: false,
                                selections: [
                                    .field(NormalizationLinkedField(
                                        name: "edges",
                                        concreteType: "TweetGroupEdge",
                                        plural: true,
                                        selections: [
                                            .field(NormalizationLinkedField(
                                                name: "node",
                                                concreteType: "TweetGroup",
                                                plural: false,
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
                                                        ]
                                                    )),
                                                    .field(NormalizationScalarField(
                                                        name: "__typename"
                                                    )),
                                                ]
                                            )),
                                            .field(NormalizationScalarField(
                                                name: "cursor"
                                            )),
                                        ]
                                    )),
                                    .field(NormalizationLinkedField(
                                        name: "pageInfo",
                                        concreteType: "PageInfo",
                                        plural: false,
                                        selections: [
                                            .field(NormalizationScalarField(
                                                name: "endCursor"
                                            )),
                                            .field(NormalizationScalarField(
                                                name: "hasNextPage"
                                            )),
                                        ]
                                    )),
                                ]
                            )),
                            .handle(NormalizationHandle(
                                kind: .linked,
                                name: "allTweets",
                                args: [
                                    VariableArgument(name: "filter", variableName: "filter"),
                                    LiteralArgument(name: "first", value: 10),
                                ],
                                handle: "connection",
                                key: "TweetsList_allTweets",
                                filters: ["filter"]
                            )),
                        ]
                    )),
                ]
            ),
            params: RequestParameters(
                name: "TweetsScreenQuery",
                operationKind: .query,
                text: """
query TweetsScreenQuery(
  $filter: TweetFilter!
) {
  viewer {
    ...TweetsList_tweets_Vt7Yj
  }
}

fragment TweetRow_tweetGroup on TweetGroup {
  id
  status
  postedAt
  tweets {
    body
    mediaURLs
  }
}

fragment TweetsList_tweets_Vt7Yj on Viewer {
  allTweets(filter: $filter, first: 10) {
    edges {
      node {
        id
        ...TweetRow_tweetGroup
        __typename
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
"""
            )
        )
    }

    struct Variables: VariableDataConvertible {
        var filter: TweetFilter?

        var variableData: VariableData {
            [
                "filter": filter,
            ]
        }
    }

    struct Data: Readable {
        var viewer: Viewer_viewer?

        init(from data: SelectorData) {
            viewer = data.get(Viewer_viewer?.self, "viewer")
        }

        struct Viewer_viewer: Readable, TweetsList_tweets_Key {
            var fragment_TweetsList_tweets: FragmentPointer

            init(from data: SelectorData) {
                fragment_TweetsList_tweets = data.get(fragment: "TweetsList_tweets")
            }

        }
    }
}

enum TweetFilter: String, Hashable, VariableValueConvertible, ReadableScalar, CustomStringConvertible {
    case upcoming = "UPCOMING"
    case past = "PAST"

    var description: String {
        rawValue
    }
}
