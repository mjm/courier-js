import Combine
import Relay
import CourierGenerated

struct TweetPostedEvent: Decodable {
    var userID: String
    var itemID: String
    var autoposted: Bool?

    enum CodingKeys: String, CodingKey {
        case userID = "user_id"
        case itemID = "item_id"
        case autoposted = "autoposted"
    }
}

private let query = graphql("""
query TweetPostedEventQuery($id: ID!) {
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
""")

func handleTweetPosted(_ environment: Environment, _ event: TweetPostedEvent) -> AnyPublisher<Never, Error> {
    environment.fetchQuery(TweetPostedEventQuery(variables: .init(id: event.itemID)))
        .ignoreOutput()
        .eraseToAnyPublisher()
}
