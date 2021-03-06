// Auto-generated by relay-compiler. Do not edit.

import Relay

public struct FeedPostRowPreviewQuery {
    public var variables: Variables

    public init(variables: Variables) {
        self.variables = variables
    }

    public static var node: ConcreteRequest {
        ConcreteRequest(
            fragment: ReaderFragment(
                name: "FeedPostRowPreviewQuery",
                type: "Query",
                selections: [
                    .field(ReaderLinkedField(
                        name: "feed",
                        storageKey: "feed(id:\"foo\")",
                        args: [
                            LiteralArgument(name: "id", value: "foo")
                        ],
                        concreteType: "Feed",
                        plural: false,
                        selections: [
                            .field(ReaderLinkedField(
                                name: "posts",
                                concreteType: "PostConnection",
                                plural: false,
                                selections: [
                                    .field(ReaderLinkedField(
                                        name: "edges",
                                        concreteType: "PostEdge",
                                        plural: true,
                                        selections: [
                                            .field(ReaderLinkedField(
                                                name: "node",
                                                concreteType: "Post",
                                                plural: false,
                                                selections: [
                                                    .field(ReaderScalarField(
                                                        name: "id"
                                                    )),
                                                    .fragmentSpread(ReaderFragmentSpread(
                                                        name: "FeedPostRow_post"
                                                    ))
                                                ]
                                            ))
                                        ]
                                    ))
                                ]
                            ))
                        ]
                    ))
                ]
            ),
            operation: NormalizationOperation(
                name: "FeedPostRowPreviewQuery",
                selections: [
                    .field(NormalizationLinkedField(
                        name: "feed",
                        args: [
                            LiteralArgument(name: "id", value: "foo")
                        ],
                        storageKey: "feed(id:\"foo\")",
                        concreteType: "Feed",
                        plural: false,
                        selections: [
                            .field(NormalizationLinkedField(
                                name: "posts",
                                concreteType: "PostConnection",
                                plural: false,
                                selections: [
                                    .field(NormalizationLinkedField(
                                        name: "edges",
                                        concreteType: "PostEdge",
                                        plural: true,
                                        selections: [
                                            .field(NormalizationLinkedField(
                                                name: "node",
                                                concreteType: "Post",
                                                plural: false,
                                                selections: [
                                                    .field(NormalizationScalarField(
                                                        name: "id"
                                                    )),
                                                    .field(NormalizationScalarField(
                                                        name: "url"
                                                    )),
                                                    .field(NormalizationScalarField(
                                                        name: "title"
                                                    )),
                                                    .field(NormalizationScalarField(
                                                        name: "htmlContent"
                                                    )),
                                                    .field(NormalizationScalarField(
                                                        name: "publishedAt"
                                                    ))
                                                ]
                                            ))
                                        ]
                                    ))
                                ]
                            )),
                            .field(NormalizationScalarField(
                                name: "id"
                            ))
                        ]
                    ))
                ]
            ),
            params: RequestParameters(
                name: "FeedPostRowPreviewQuery",
                operationKind: .query,
                text: """
query FeedPostRowPreviewQuery {
  feed(id: "foo") {
    posts {
      edges {
        node {
          id
          ...FeedPostRow_post
        }
      }
    }
    id
  }
}

fragment FeedPostRow_post on Post {
  id
  url
  title
  htmlContent
  publishedAt
}
"""
            )
        )
    }
}

extension FeedPostRowPreviewQuery {
    public typealias Variables = EmptyVariables
}



extension FeedPostRowPreviewQuery {
    public struct Data: Decodable {
        public var feed: Feed_feed?

        public struct Feed_feed: Decodable {
            public var posts: PostConnection_posts

            public struct PostConnection_posts: Decodable {
                public var edges: [PostEdge_edges]

                public struct PostEdge_edges: Decodable {
                    public var node: Post_node

                    public struct Post_node: Decodable, Identifiable, FeedPostRow_post_Key {
                        public var id: String
                        public var fragment_FeedPostRow_post: FragmentPointer
                    }
                }
            }
        }
    }
}

extension FeedPostRowPreviewQuery: Relay.Operation {}