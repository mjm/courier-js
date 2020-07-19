import Combine
import Relay
import CourierGenerated

struct TweetEditedEvent: Decodable {
    var userID: String
    var itemID: String

    enum CodingKeys: String, CodingKey {
        case userID = "user_id"
        case itemID = "item_id"
    }
}

private let query = graphql("""
query TweetEditedEventQuery($id: ID!) {
  tweetGroup(id: $id) {
    id
    tweets {
      body
      mediaURLs
    }
  }
}
""")

func handleTweetEdited(_ environment: Environment, _ event: TweetEditedEvent) -> AnyPublisher<Never, Error> {
    environment.fetchQuery(TweetEditedEventQuery(id: event.itemID))
        .ignoreOutput()
        .eraseToAnyPublisher()
}
