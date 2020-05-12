import Relay

struct TweetsListPaginationQuery: Operation {
    var node: ConcreteRequest {
        return ConcreteRequest(
            fragment: ReaderFragment(
                name: "TweetsListPaginationQuery",
                selections: [
                    .field(ReaderLinkedField(
                        name: "viewer",
                        concreteType: "Viewer",
                        plural: false,
                        selections: [
                            .fragmentSpread(ReaderFragmentSpread(
                                name: "TweetsList_tweets",
                                args: [
                                    VariableArgument(name: "count", variableName: "count"),
                                    VariableArgument(name: "cursor", variableName: "cursor"),
                                    VariableArgument(name: "filter", variableName: "filter"),
                                ]
                            )),
                        ]
                    )),
                ]
            ),
            operation: NormalizationOperation(
                name: "TweetsListPaginationQuery",
                selections: [
                    .field(NormalizationLinkedField(
                        name: "viewer",
                        concreteType: "Viewer",
                        plural: false,
                        selections: [
                            .field(NormalizationLinkedField(
                                name: "allTweets",
                                args: [
                                    VariableArgument(name: "after", variableName: "cursor"),
                                    VariableArgument(name: "filter", variableName: "filter"),
                                    VariableArgument(name: "first", variableName: "count"),
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
                                    VariableArgument(name: "after", variableName: "cursor"),
                                    VariableArgument(name: "filter", variableName: "filter"),
                                    VariableArgument(name: "first", variableName: "count"),
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
                name: "TweetsListPaginationQuery",
                operationKind: .query,
                text: """
query TweetsListPaginationQuery(
  $filter: TweetFilter
  $count: Int = 10
  $cursor: Cursor
) {
  viewer {
    ...TweetsList_tweets_3KQYpM
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

fragment TweetsList_tweets_3KQYpM on Viewer {
  allTweets(filter: $filter, first: $count, after: $cursor) {
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
        var count: Int?
        var cursor: Cursor?

        var variableData: VariableData {
            [
                "filter": filter,
                "count": count,
                "cursor": cursor,
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
