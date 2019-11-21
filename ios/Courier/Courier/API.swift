//  This file was automatically generated and should not be edited.

import Apollo
import Foundation

public struct AddDeviceInput: GraphQLMapConvertible {
  public var graphQLMap: GraphQLMap

  public init(token: String, environment: Swift.Optional<NotificationEnvironment?> = nil) {
    graphQLMap = ["token": token, "environment": environment]
  }

  public var token: String {
    get {
      return graphQLMap["token"] as! String
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "token")
    }
  }

  public var environment: Swift.Optional<NotificationEnvironment?> {
    get {
      return graphQLMap["environment"] as? Swift.Optional<NotificationEnvironment?> ?? Swift.Optional<NotificationEnvironment?>.none
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "environment")
    }
  }
}

public enum NotificationEnvironment: RawRepresentable, Equatable, Hashable, CaseIterable, Apollo.JSONDecodable, Apollo.JSONEncodable {
  public typealias RawValue = String
  case production
  case sandbox
  /// Auto generated constant for unknown enum values
  case __unknown(RawValue)

  public init?(rawValue: RawValue) {
    switch rawValue {
      case "PRODUCTION": self = .production
      case "SANDBOX": self = .sandbox
      default: self = .__unknown(rawValue)
    }
  }

  public var rawValue: RawValue {
    switch self {
      case .production: return "PRODUCTION"
      case .sandbox: return "SANDBOX"
      case .__unknown(let value): return value
    }
  }

  public static func == (lhs: NotificationEnvironment, rhs: NotificationEnvironment) -> Bool {
    switch (lhs, rhs) {
      case (.production, .production): return true
      case (.sandbox, .sandbox): return true
      case (.__unknown(let lhsValue), .__unknown(let rhsValue)): return lhsValue == rhsValue
      default: return false
    }
  }

  public static var allCases: [NotificationEnvironment] {
    return [
      .production,
      .sandbox,
    ]
  }
}

public struct CancelTweetInput: GraphQLMapConvertible {
  public var graphQLMap: GraphQLMap

  public init(id: GraphQLID) {
    graphQLMap = ["id": id]
  }

  public var id: GraphQLID {
    get {
      return graphQLMap["id"] as! GraphQLID
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "id")
    }
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

public struct UncancelTweetInput: GraphQLMapConvertible {
  public var graphQLMap: GraphQLMap

  public init(id: GraphQLID) {
    graphQLMap = ["id": id]
  }

  public var id: GraphQLID {
    get {
      return graphQLMap["id"] as! GraphQLID
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "id")
    }
  }
}

public struct PostTweetInput: GraphQLMapConvertible {
  public var graphQLMap: GraphQLMap

  public init(id: GraphQLID, body: Swift.Optional<String?> = nil, mediaUrLs: Swift.Optional<[String]?> = nil) {
    graphQLMap = ["id": id, "body": body, "mediaURLs": mediaUrLs]
  }

  public var id: GraphQLID {
    get {
      return graphQLMap["id"] as! GraphQLID
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "id")
    }
  }

  public var body: Swift.Optional<String?> {
    get {
      return graphQLMap["body"] as? Swift.Optional<String?> ?? Swift.Optional<String?>.none
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "body")
    }
  }

  public var mediaUrLs: Swift.Optional<[String]?> {
    get {
      return graphQLMap["mediaURLs"] as? Swift.Optional<[String]?> ?? Swift.Optional<[String]?>.none
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "mediaURLs")
    }
  }
}

public struct EditTweetInput: GraphQLMapConvertible {
  public var graphQLMap: GraphQLMap

  public init(id: GraphQLID, body: String, mediaUrLs: Swift.Optional<[String]?> = nil) {
    graphQLMap = ["id": id, "body": body, "mediaURLs": mediaUrLs]
  }

  public var id: GraphQLID {
    get {
      return graphQLMap["id"] as! GraphQLID
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "id")
    }
  }

  public var body: String {
    get {
      return graphQLMap["body"] as! String
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "body")
    }
  }

  public var mediaUrLs: Swift.Optional<[String]?> {
    get {
      return graphQLMap["mediaURLs"] as? Swift.Optional<[String]?> ?? Swift.Optional<[String]?>.none
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "mediaURLs")
    }
  }
}

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

public final class RegisterDeviceMutation: GraphQLMutation {
  /// The raw GraphQL definition of this operation.
  public let operationDefinition =
    """
    mutation RegisterDevice($input: AddDeviceInput!) {
      addDevice(input: $input) {
        __typename
        deviceToken {
          __typename
          id
        }
      }
    }
    """

  public let operationName = "RegisterDevice"

  public var input: AddDeviceInput

  public init(input: AddDeviceInput) {
    self.input = input
  }

  public var variables: GraphQLMap? {
    return ["input": input]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Mutation"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("addDevice", arguments: ["input": GraphQLVariable("input")], type: .nonNull(.object(AddDevice.selections))),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(addDevice: AddDevice) {
      self.init(unsafeResultMap: ["__typename": "Mutation", "addDevice": addDevice.resultMap])
    }

    public var addDevice: AddDevice {
      get {
        return AddDevice(unsafeResultMap: resultMap["addDevice"]! as! ResultMap)
      }
      set {
        resultMap.updateValue(newValue.resultMap, forKey: "addDevice")
      }
    }

    public struct AddDevice: GraphQLSelectionSet {
      public static let possibleTypes = ["AddDevicePayload"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("deviceToken", type: .nonNull(.object(DeviceToken.selections))),
      ]

      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public init(deviceToken: DeviceToken) {
        self.init(unsafeResultMap: ["__typename": "AddDevicePayload", "deviceToken": deviceToken.resultMap])
      }

      public var __typename: String {
        get {
          return resultMap["__typename"]! as! String
        }
        set {
          resultMap.updateValue(newValue, forKey: "__typename")
        }
      }

      public var deviceToken: DeviceToken {
        get {
          return DeviceToken(unsafeResultMap: resultMap["deviceToken"]! as! ResultMap)
        }
        set {
          resultMap.updateValue(newValue.resultMap, forKey: "deviceToken")
        }
      }

      public struct DeviceToken: GraphQLSelectionSet {
        public static let possibleTypes = ["DeviceToken"]

        public static let selections: [GraphQLSelection] = [
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("id", type: .nonNull(.scalar(GraphQLID.self))),
        ]

        public private(set) var resultMap: ResultMap

        public init(unsafeResultMap: ResultMap) {
          self.resultMap = unsafeResultMap
        }

        public init(id: GraphQLID) {
          self.init(unsafeResultMap: ["__typename": "DeviceToken", "id": id])
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
      }
    }
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

public final class GetTweetQuery: GraphQLQuery {
  /// The raw GraphQL definition of this operation.
  public let operationDefinition =
    """
    query GetTweet($id: ID!) {
      tweet(id: $id) {
        __typename
        ...allTweetsFields
      }
    }
    """

  public let operationName = "GetTweet"

  public var queryDocument: String { return operationDefinition.appending(AllTweetsFields.fragmentDefinition) }

  public var id: GraphQLID

  public init(id: GraphQLID) {
    self.id = id
  }

  public var variables: GraphQLMap? {
    return ["id": id]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Query"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("tweet", arguments: ["id": GraphQLVariable("id")], type: .object(Tweet.selections)),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(tweet: Tweet? = nil) {
      self.init(unsafeResultMap: ["__typename": "Query", "tweet": tweet.flatMap { (value: Tweet) -> ResultMap in value.resultMap }])
    }

    public var tweet: Tweet? {
      get {
        return (resultMap["tweet"] as? ResultMap).flatMap { Tweet(unsafeResultMap: $0) }
      }
      set {
        resultMap.updateValue(newValue?.resultMap, forKey: "tweet")
      }
    }

    public struct Tweet: GraphQLSelectionSet {
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
  }
}

public final class CancelTweetMutation: GraphQLMutation {
  /// The raw GraphQL definition of this operation.
  public let operationDefinition =
    """
    mutation CancelTweet($input: CancelTweetInput!) {
      cancelTweet(input: $input) {
        __typename
        tweet {
          __typename
          id
          status
        }
      }
    }
    """

  public let operationName = "CancelTweet"

  public var input: CancelTweetInput

  public init(input: CancelTweetInput) {
    self.input = input
  }

  public var variables: GraphQLMap? {
    return ["input": input]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Mutation"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("cancelTweet", arguments: ["input": GraphQLVariable("input")], type: .nonNull(.object(CancelTweet.selections))),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(cancelTweet: CancelTweet) {
      self.init(unsafeResultMap: ["__typename": "Mutation", "cancelTweet": cancelTweet.resultMap])
    }

    public var cancelTweet: CancelTweet {
      get {
        return CancelTweet(unsafeResultMap: resultMap["cancelTweet"]! as! ResultMap)
      }
      set {
        resultMap.updateValue(newValue.resultMap, forKey: "cancelTweet")
      }
    }

    public struct CancelTweet: GraphQLSelectionSet {
      public static let possibleTypes = ["CancelTweetPayload"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("tweet", type: .nonNull(.object(Tweet.selections))),
      ]

      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public init(tweet: Tweet) {
        self.init(unsafeResultMap: ["__typename": "CancelTweetPayload", "tweet": tweet.resultMap])
      }

      public var __typename: String {
        get {
          return resultMap["__typename"]! as! String
        }
        set {
          resultMap.updateValue(newValue, forKey: "__typename")
        }
      }

      public var tweet: Tweet {
        get {
          return Tweet(unsafeResultMap: resultMap["tweet"]! as! ResultMap)
        }
        set {
          resultMap.updateValue(newValue.resultMap, forKey: "tweet")
        }
      }

      public struct Tweet: GraphQLSelectionSet {
        public static let possibleTypes = ["Tweet"]

        public static let selections: [GraphQLSelection] = [
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("id", type: .nonNull(.scalar(GraphQLID.self))),
          GraphQLField("status", type: .nonNull(.scalar(TweetStatus.self))),
        ]

        public private(set) var resultMap: ResultMap

        public init(unsafeResultMap: ResultMap) {
          self.resultMap = unsafeResultMap
        }

        public init(id: GraphQLID, status: TweetStatus) {
          self.init(unsafeResultMap: ["__typename": "Tweet", "id": id, "status": status])
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

        public var status: TweetStatus {
          get {
            return resultMap["status"]! as! TweetStatus
          }
          set {
            resultMap.updateValue(newValue, forKey: "status")
          }
        }
      }
    }
  }
}

public final class UncancelTweetMutation: GraphQLMutation {
  /// The raw GraphQL definition of this operation.
  public let operationDefinition =
    """
    mutation UncancelTweet($input: UncancelTweetInput!) {
      uncancelTweet(input: $input) {
        __typename
        tweet {
          __typename
          id
          status
        }
      }
    }
    """

  public let operationName = "UncancelTweet"

  public var input: UncancelTweetInput

  public init(input: UncancelTweetInput) {
    self.input = input
  }

  public var variables: GraphQLMap? {
    return ["input": input]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Mutation"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("uncancelTweet", arguments: ["input": GraphQLVariable("input")], type: .nonNull(.object(UncancelTweet.selections))),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(uncancelTweet: UncancelTweet) {
      self.init(unsafeResultMap: ["__typename": "Mutation", "uncancelTweet": uncancelTweet.resultMap])
    }

    public var uncancelTweet: UncancelTweet {
      get {
        return UncancelTweet(unsafeResultMap: resultMap["uncancelTweet"]! as! ResultMap)
      }
      set {
        resultMap.updateValue(newValue.resultMap, forKey: "uncancelTweet")
      }
    }

    public struct UncancelTweet: GraphQLSelectionSet {
      public static let possibleTypes = ["UncancelTweetPayload"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("tweet", type: .nonNull(.object(Tweet.selections))),
      ]

      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public init(tweet: Tweet) {
        self.init(unsafeResultMap: ["__typename": "UncancelTweetPayload", "tweet": tweet.resultMap])
      }

      public var __typename: String {
        get {
          return resultMap["__typename"]! as! String
        }
        set {
          resultMap.updateValue(newValue, forKey: "__typename")
        }
      }

      public var tweet: Tweet {
        get {
          return Tweet(unsafeResultMap: resultMap["tweet"]! as! ResultMap)
        }
        set {
          resultMap.updateValue(newValue.resultMap, forKey: "tweet")
        }
      }

      public struct Tweet: GraphQLSelectionSet {
        public static let possibleTypes = ["Tweet"]

        public static let selections: [GraphQLSelection] = [
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("id", type: .nonNull(.scalar(GraphQLID.self))),
          GraphQLField("status", type: .nonNull(.scalar(TweetStatus.self))),
        ]

        public private(set) var resultMap: ResultMap

        public init(unsafeResultMap: ResultMap) {
          self.resultMap = unsafeResultMap
        }

        public init(id: GraphQLID, status: TweetStatus) {
          self.init(unsafeResultMap: ["__typename": "Tweet", "id": id, "status": status])
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

        public var status: TweetStatus {
          get {
            return resultMap["status"]! as! TweetStatus
          }
          set {
            resultMap.updateValue(newValue, forKey: "status")
          }
        }
      }
    }
  }
}

public final class PostTweetMutation: GraphQLMutation {
  /// The raw GraphQL definition of this operation.
  public let operationDefinition =
    """
    mutation PostTweet($input: PostTweetInput!) {
      postTweet(input: $input) {
        __typename
        tweet {
          __typename
          id
          body
          mediaURLs
          status
          postedAt
          postedTweetID
        }
      }
    }
    """

  public let operationName = "PostTweet"

  public var input: PostTweetInput

  public init(input: PostTweetInput) {
    self.input = input
  }

  public var variables: GraphQLMap? {
    return ["input": input]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Mutation"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("postTweet", arguments: ["input": GraphQLVariable("input")], type: .nonNull(.object(PostTweet.selections))),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(postTweet: PostTweet) {
      self.init(unsafeResultMap: ["__typename": "Mutation", "postTweet": postTweet.resultMap])
    }

    public var postTweet: PostTweet {
      get {
        return PostTweet(unsafeResultMap: resultMap["postTweet"]! as! ResultMap)
      }
      set {
        resultMap.updateValue(newValue.resultMap, forKey: "postTweet")
      }
    }

    public struct PostTweet: GraphQLSelectionSet {
      public static let possibleTypes = ["PostTweetPayload"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("tweet", type: .nonNull(.object(Tweet.selections))),
      ]

      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public init(tweet: Tweet) {
        self.init(unsafeResultMap: ["__typename": "PostTweetPayload", "tweet": tweet.resultMap])
      }

      public var __typename: String {
        get {
          return resultMap["__typename"]! as! String
        }
        set {
          resultMap.updateValue(newValue, forKey: "__typename")
        }
      }

      public var tweet: Tweet {
        get {
          return Tweet(unsafeResultMap: resultMap["tweet"]! as! ResultMap)
        }
        set {
          resultMap.updateValue(newValue.resultMap, forKey: "tweet")
        }
      }

      public struct Tweet: GraphQLSelectionSet {
        public static let possibleTypes = ["Tweet"]

        public static let selections: [GraphQLSelection] = [
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("id", type: .nonNull(.scalar(GraphQLID.self))),
          GraphQLField("body", type: .nonNull(.scalar(String.self))),
          GraphQLField("mediaURLs", type: .nonNull(.list(.nonNull(.scalar(String.self))))),
          GraphQLField("status", type: .nonNull(.scalar(TweetStatus.self))),
          GraphQLField("postedAt", type: .scalar(String.self)),
          GraphQLField("postedTweetID", type: .scalar(String.self)),
        ]

        public private(set) var resultMap: ResultMap

        public init(unsafeResultMap: ResultMap) {
          self.resultMap = unsafeResultMap
        }

        public init(id: GraphQLID, body: String, mediaUrLs: [String], status: TweetStatus, postedAt: String? = nil, postedTweetId: String? = nil) {
          self.init(unsafeResultMap: ["__typename": "Tweet", "id": id, "body": body, "mediaURLs": mediaUrLs, "status": status, "postedAt": postedAt, "postedTweetID": postedTweetId])
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

        public var status: TweetStatus {
          get {
            return resultMap["status"]! as! TweetStatus
          }
          set {
            resultMap.updateValue(newValue, forKey: "status")
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
      }
    }
  }
}

public final class EditTweetMutation: GraphQLMutation {
  /// The raw GraphQL definition of this operation.
  public let operationDefinition =
    """
    mutation EditTweet($input: EditTweetInput!) {
      editTweet(input: $input) {
        __typename
        tweet {
          __typename
          id
          body
          mediaURLs
        }
      }
    }
    """

  public let operationName = "EditTweet"

  public var input: EditTweetInput

  public init(input: EditTweetInput) {
    self.input = input
  }

  public var variables: GraphQLMap? {
    return ["input": input]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Mutation"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("editTweet", arguments: ["input": GraphQLVariable("input")], type: .nonNull(.object(EditTweet.selections))),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(editTweet: EditTweet) {
      self.init(unsafeResultMap: ["__typename": "Mutation", "editTweet": editTweet.resultMap])
    }

    public var editTweet: EditTweet {
      get {
        return EditTweet(unsafeResultMap: resultMap["editTweet"]! as! ResultMap)
      }
      set {
        resultMap.updateValue(newValue.resultMap, forKey: "editTweet")
      }
    }

    public struct EditTweet: GraphQLSelectionSet {
      public static let possibleTypes = ["EditTweetPayload"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("tweet", type: .nonNull(.object(Tweet.selections))),
      ]

      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public init(tweet: Tweet) {
        self.init(unsafeResultMap: ["__typename": "EditTweetPayload", "tweet": tweet.resultMap])
      }

      public var __typename: String {
        get {
          return resultMap["__typename"]! as! String
        }
        set {
          resultMap.updateValue(newValue, forKey: "__typename")
        }
      }

      public var tweet: Tweet {
        get {
          return Tweet(unsafeResultMap: resultMap["tweet"]! as! ResultMap)
        }
        set {
          resultMap.updateValue(newValue.resultMap, forKey: "tweet")
        }
      }

      public struct Tweet: GraphQLSelectionSet {
        public static let possibleTypes = ["Tweet"]

        public static let selections: [GraphQLSelection] = [
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("id", type: .nonNull(.scalar(GraphQLID.self))),
          GraphQLField("body", type: .nonNull(.scalar(String.self))),
          GraphQLField("mediaURLs", type: .nonNull(.list(.nonNull(.scalar(String.self))))),
        ]

        public private(set) var resultMap: ResultMap

        public init(unsafeResultMap: ResultMap) {
          self.resultMap = unsafeResultMap
        }

        public init(id: GraphQLID, body: String, mediaUrLs: [String]) {
          self.init(unsafeResultMap: ["__typename": "Tweet", "id": id, "body": body, "mediaURLs": mediaUrLs])
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
