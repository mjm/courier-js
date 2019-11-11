//  This file was automatically generated and should not be edited.

import Apollo
import Foundation

public enum TweetAction: RawRepresentable, Equatable, Hashable, CaseIterable, Apollo.JSONDecodable, Apollo.JSONEncodable {
  public typealias RawValue = String
  case tweet
  case retweet
  /// Auto generated constant for unknown enum values
  case __unknown(RawValue)

  public init?(rawValue: RawValue) {
    switch rawValue {
      case "TWEET": self = .tweet
      case "RETWEET": self = .retweet
      default: self = .__unknown(rawValue)
    }
  }

  public var rawValue: RawValue {
    switch self {
      case .tweet: return "TWEET"
      case .retweet: return "RETWEET"
      case .__unknown(let value): return value
    }
  }

  public static func == (lhs: TweetAction, rhs: TweetAction) -> Bool {
    switch (lhs, rhs) {
      case (.tweet, .tweet): return true
      case (.retweet, .retweet): return true
      case (.__unknown(let lhsValue), .__unknown(let rhsValue)): return lhsValue == rhsValue
      default: return false
    }
  }

  public static var allCases: [TweetAction] {
    return [
      .tweet,
      .retweet,
    ]
  }
}

public enum TweetStatus: RawRepresentable, Equatable, Hashable, CaseIterable, Apollo.JSONDecodable, Apollo.JSONEncodable {
  public typealias RawValue = String
  case draft
  case canceled
  case posted
  /// Auto generated constant for unknown enum values
  case __unknown(RawValue)

  public init?(rawValue: RawValue) {
    switch rawValue {
      case "DRAFT": self = .draft
      case "CANCELED": self = .canceled
      case "POSTED": self = .posted
      default: self = .__unknown(rawValue)
    }
  }

  public var rawValue: RawValue {
    switch self {
      case .draft: return "DRAFT"
      case .canceled: return "CANCELED"
      case .posted: return "POSTED"
      case .__unknown(let value): return value
    }
  }

  public static func == (lhs: TweetStatus, rhs: TweetStatus) -> Bool {
    switch (lhs, rhs) {
      case (.draft, .draft): return true
      case (.canceled, .canceled): return true
      case (.posted, .posted): return true
      case (.__unknown(let lhsValue), .__unknown(let rhsValue)): return lhsValue == rhsValue
      default: return false
    }
  }

  public static var allCases: [TweetStatus] {
    return [
      .draft,
      .canceled,
      .posted,
    ]
  }
}

public final class UpcomingTweetsQuery: GraphQLQuery {
  /// The raw GraphQL definition of this operation.
  public let operationDefinition =
    """
    query UpcomingTweets($cursor: Cursor) {
      allTweets(filter: UPCOMING, last: 10, before: $cursor) {
        __typename
        ...tweetConnectionFields
      }
    }
    """

  public let operationName = "UpcomingTweets"

  public var queryDocument: String { return operationDefinition.appending(TweetConnectionFields.fragmentDefinition).appending(AllTweetsFields.fragmentDefinition) }

  public var cursor: String?

  public init(cursor: String? = nil) {
    self.cursor = cursor
  }

  public var variables: GraphQLMap? {
    return ["cursor": cursor]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Query"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("allTweets", arguments: ["filter": "UPCOMING", "last": 10, "before": GraphQLVariable("cursor")], type: .nonNull(.object(AllTweet.selections))),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(allTweets: AllTweet) {
      self.init(unsafeResultMap: ["__typename": "Query", "allTweets": allTweets.resultMap])
    }

    public var allTweets: AllTweet {
      get {
        return AllTweet(unsafeResultMap: resultMap["allTweets"]! as! ResultMap)
      }
      set {
        resultMap.updateValue(newValue.resultMap, forKey: "allTweets")
      }
    }

    public struct AllTweet: GraphQLSelectionSet {
      public static let possibleTypes = ["TweetConnection"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLFragmentSpread(TweetConnectionFields.self),
      ]

      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public var __typename: String {
        get {
          return resultMap["__typename"]! as! String
        }
        set {
          resultMap.updateValue(newValue, forKey: "__typename")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }

      public struct Fragments {
        public private(set) var resultMap: ResultMap

        public init(unsafeResultMap: ResultMap) {
          self.resultMap = unsafeResultMap
        }

        public var tweetConnectionFields: TweetConnectionFields {
          get {
            return TweetConnectionFields(unsafeResultMap: resultMap)
          }
          set {
            resultMap += newValue.resultMap
          }
        }
      }
    }
  }
}

public final class PastTweetsQuery: GraphQLQuery {
  /// The raw GraphQL definition of this operation.
  public let operationDefinition =
    """
    query PastTweets($cursor: Cursor) {
      allTweets(filter: PAST, last: 10, before: $cursor) {
        __typename
        ...tweetConnectionFields
      }
    }
    """

  public let operationName = "PastTweets"

  public var queryDocument: String { return operationDefinition.appending(TweetConnectionFields.fragmentDefinition).appending(AllTweetsFields.fragmentDefinition) }

  public var cursor: String?

  public init(cursor: String? = nil) {
    self.cursor = cursor
  }

  public var variables: GraphQLMap? {
    return ["cursor": cursor]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Query"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("allTweets", arguments: ["filter": "PAST", "last": 10, "before": GraphQLVariable("cursor")], type: .nonNull(.object(AllTweet.selections))),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(allTweets: AllTweet) {
      self.init(unsafeResultMap: ["__typename": "Query", "allTweets": allTweets.resultMap])
    }

    public var allTweets: AllTweet {
      get {
        return AllTweet(unsafeResultMap: resultMap["allTweets"]! as! ResultMap)
      }
      set {
        resultMap.updateValue(newValue.resultMap, forKey: "allTweets")
      }
    }

    public struct AllTweet: GraphQLSelectionSet {
      public static let possibleTypes = ["TweetConnection"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLFragmentSpread(TweetConnectionFields.self),
      ]

      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public var __typename: String {
        get {
          return resultMap["__typename"]! as! String
        }
        set {
          resultMap.updateValue(newValue, forKey: "__typename")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }

      public struct Fragments {
        public private(set) var resultMap: ResultMap

        public init(unsafeResultMap: ResultMap) {
          self.resultMap = unsafeResultMap
        }

        public var tweetConnectionFields: TweetConnectionFields {
          get {
            return TweetConnectionFields(unsafeResultMap: resultMap)
          }
          set {
            resultMap += newValue.resultMap
          }
        }
      }
    }
  }
}

public struct TweetConnectionFields: GraphQLFragment {
  /// The raw GraphQL definition of this fragment.
  public static let fragmentDefinition =
    """
    fragment tweetConnectionFields on TweetConnection {
      __typename
      nodes {
        __typename
        ...allTweetsFields
      }
      pageInfo {
        __typename
        hasPreviousPage
        endCursor
      }
      totalCount
    }
    """

  public static let possibleTypes = ["TweetConnection"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("nodes", type: .nonNull(.list(.nonNull(.object(Node.selections))))),
    GraphQLField("pageInfo", type: .nonNull(.object(PageInfo.selections))),
    GraphQLField("totalCount", type: .nonNull(.scalar(Int.self))),
  ]

  public private(set) var resultMap: ResultMap

  public init(unsafeResultMap: ResultMap) {
    self.resultMap = unsafeResultMap
  }

  public init(nodes: [Node], pageInfo: PageInfo, totalCount: Int) {
    self.init(unsafeResultMap: ["__typename": "TweetConnection", "nodes": nodes.map { (value: Node) -> ResultMap in value.resultMap }, "pageInfo": pageInfo.resultMap, "totalCount": totalCount])
  }

  public var __typename: String {
    get {
      return resultMap["__typename"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "__typename")
    }
  }

  public var nodes: [Node] {
    get {
      return (resultMap["nodes"] as! [ResultMap]).map { (value: ResultMap) -> Node in Node(unsafeResultMap: value) }
    }
    set {
      resultMap.updateValue(newValue.map { (value: Node) -> ResultMap in value.resultMap }, forKey: "nodes")
    }
  }

  public var pageInfo: PageInfo {
    get {
      return PageInfo(unsafeResultMap: resultMap["pageInfo"]! as! ResultMap)
    }
    set {
      resultMap.updateValue(newValue.resultMap, forKey: "pageInfo")
    }
  }

  public var totalCount: Int {
    get {
      return resultMap["totalCount"]! as! Int
    }
    set {
      resultMap.updateValue(newValue, forKey: "totalCount")
    }
  }

  public struct Node: GraphQLSelectionSet {
    public static let possibleTypes = ["Tweet"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLFragmentSpread(AllTweetsFields.self),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public var __typename: String {
      get {
        return resultMap["__typename"]! as! String
      }
      set {
        resultMap.updateValue(newValue, forKey: "__typename")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(unsafeResultMap: resultMap)
      }
      set {
        resultMap += newValue.resultMap
      }
    }

    public struct Fragments {
      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public var allTweetsFields: AllTweetsFields {
        get {
          return AllTweetsFields(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }
    }
  }

  public struct PageInfo: GraphQLSelectionSet {
    public static let possibleTypes = ["PageInfo"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("hasPreviousPage", type: .nonNull(.scalar(Bool.self))),
      GraphQLField("endCursor", type: .scalar(String.self)),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(hasPreviousPage: Bool, endCursor: String? = nil) {
      self.init(unsafeResultMap: ["__typename": "PageInfo", "hasPreviousPage": hasPreviousPage, "endCursor": endCursor])
    }

    public var __typename: String {
      get {
        return resultMap["__typename"]! as! String
      }
      set {
        resultMap.updateValue(newValue, forKey: "__typename")
      }
    }

    public var hasPreviousPage: Bool {
      get {
        return resultMap["hasPreviousPage"]! as! Bool
      }
      set {
        resultMap.updateValue(newValue, forKey: "hasPreviousPage")
      }
    }

    public var endCursor: String? {
      get {
        return resultMap["endCursor"] as? String
      }
      set {
        resultMap.updateValue(newValue, forKey: "endCursor")
      }
    }
  }
}

public struct AllTweetsFields: GraphQLFragment {
  /// The raw GraphQL definition of this fragment.
  public static let fragmentDefinition =
    """
    fragment allTweetsFields on Tweet {
      __typename
      id
      post {
        __typename
        id
        url
        publishedAt
        modifiedAt
      }
      action
      body
      mediaURLs
      retweetID
      status
      postAfter
      postedAt
      postedTweetID
    }
    """

  public static let possibleTypes = ["Tweet"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("id", type: .nonNull(.scalar(GraphQLID.self))),
    GraphQLField("post", type: .nonNull(.object(Post.selections))),
    GraphQLField("action", type: .nonNull(.scalar(TweetAction.self))),
    GraphQLField("body", type: .nonNull(.scalar(String.self))),
    GraphQLField("mediaURLs", type: .nonNull(.list(.nonNull(.scalar(String.self))))),
    GraphQLField("retweetID", type: .nonNull(.scalar(String.self))),
    GraphQLField("status", type: .nonNull(.scalar(TweetStatus.self))),
    GraphQLField("postAfter", type: .scalar(String.self)),
    GraphQLField("postedAt", type: .scalar(String.self)),
    GraphQLField("postedTweetID", type: .scalar(String.self)),
  ]

  public private(set) var resultMap: ResultMap

  public init(unsafeResultMap: ResultMap) {
    self.resultMap = unsafeResultMap
  }

  public init(id: GraphQLID, post: Post, action: TweetAction, body: String, mediaUrLs: [String], retweetId: String, status: TweetStatus, postAfter: String? = nil, postedAt: String? = nil, postedTweetId: String? = nil) {
    self.init(unsafeResultMap: ["__typename": "Tweet", "id": id, "post": post.resultMap, "action": action, "body": body, "mediaURLs": mediaUrLs, "retweetID": retweetId, "status": status, "postAfter": postAfter, "postedAt": postedAt, "postedTweetID": postedTweetId])
  }

  public var __typename: String {
    get {
      return resultMap["__typename"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "__typename")
    }
  }

  public var id: GraphQLID {
    get {
      return resultMap["id"]! as! GraphQLID
    }
    set {
      resultMap.updateValue(newValue, forKey: "id")
    }
  }

  public var post: Post {
    get {
      return Post(unsafeResultMap: resultMap["post"]! as! ResultMap)
    }
    set {
      resultMap.updateValue(newValue.resultMap, forKey: "post")
    }
  }

  public var action: TweetAction {
    get {
      return resultMap["action"]! as! TweetAction
    }
    set {
      resultMap.updateValue(newValue, forKey: "action")
    }
  }

  public var body: String {
    get {
      return resultMap["body"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "body")
    }
  }

  public var mediaUrLs: [String] {
    get {
      return resultMap["mediaURLs"]! as! [String]
    }
    set {
      resultMap.updateValue(newValue, forKey: "mediaURLs")
    }
  }

  public var retweetId: String {
    get {
      return resultMap["retweetID"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "retweetID")
    }
  }

  public var status: TweetStatus {
    get {
      return resultMap["status"]! as! TweetStatus
    }
    set {
      resultMap.updateValue(newValue, forKey: "status")
    }
  }

  public var postAfter: String? {
    get {
      return resultMap["postAfter"] as? String
    }
    set {
      resultMap.updateValue(newValue, forKey: "postAfter")
    }
  }

  public var postedAt: String? {
    get {
      return resultMap["postedAt"] as? String
    }
    set {
      resultMap.updateValue(newValue, forKey: "postedAt")
    }
  }

  public var postedTweetId: String? {
    get {
      return resultMap["postedTweetID"] as? String
    }
    set {
      resultMap.updateValue(newValue, forKey: "postedTweetID")
    }
  }

  public struct Post: GraphQLSelectionSet {
    public static let possibleTypes = ["Post"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("id", type: .nonNull(.scalar(GraphQLID.self))),
      GraphQLField("url", type: .nonNull(.scalar(String.self))),
      GraphQLField("publishedAt", type: .scalar(String.self)),
      GraphQLField("modifiedAt", type: .scalar(String.self)),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(id: GraphQLID, url: String, publishedAt: String? = nil, modifiedAt: String? = nil) {
      self.init(unsafeResultMap: ["__typename": "Post", "id": id, "url": url, "publishedAt": publishedAt, "modifiedAt": modifiedAt])
    }

    public var __typename: String {
      get {
        return resultMap["__typename"]! as! String
      }
      set {
        resultMap.updateValue(newValue, forKey: "__typename")
      }
    }

    public var id: GraphQLID {
      get {
        return resultMap["id"]! as! GraphQLID
      }
      set {
        resultMap.updateValue(newValue, forKey: "id")
      }
    }

    public var url: String {
      get {
        return resultMap["url"]! as! String
      }
      set {
        resultMap.updateValue(newValue, forKey: "url")
      }
    }

    public var publishedAt: String? {
      get {
        return resultMap["publishedAt"] as? String
      }
      set {
        resultMap.updateValue(newValue, forKey: "publishedAt")
      }
    }

    public var modifiedAt: String? {
      get {
        return resultMap["modifiedAt"] as? String
      }
      set {
        resultMap.updateValue(newValue, forKey: "modifiedAt")
      }
    }
  }
}
