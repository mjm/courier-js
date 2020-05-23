import Combine
import Relay

struct TweetUncanceledEvent: Decodable {
    var userID: String
    var itemID: String

    enum CodingKeys: String, CodingKey {
        case userID = "user_id"
        case itemID = "item_id"
    }
}

private let query = graphql("""
query TweetUncanceledEventQuery($id: ID!) {
  tweetGroup(id: $id) {
    id
    status
  }
}
""")

func handleTweetUncanceled(_ environment: Environment, _ event: TweetUncanceledEvent) -> AnyPublisher<Never, Error> {
    environment.fetchQuery(TweetUncanceledEventQuery(variables: .init(id: event.itemID)))
        .ignoreOutput()
        .eraseToAnyPublisher()
}
