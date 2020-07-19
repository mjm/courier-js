import Combine
import Relay
import CourierGenerated

struct TweetCanceledEvent: Decodable {
    var userID: String
    var itemID: String

    enum CodingKeys: String, CodingKey {
        case userID = "user_id"
        case itemID = "item_id"
    }
}

private let query = graphql("""
query TweetCanceledEventQuery($id: ID!) {
  tweetGroup(id: $id) {
    id
    status
  }
}
""")

func handleTweetCanceled(_ environment: Environment, _ event: TweetCanceledEvent) -> AnyPublisher<Never, Error> {
    environment.fetchQuery(TweetCanceledEventQuery(variables: .init(id: event.itemID)))
        .ignoreOutput()
        .eraseToAnyPublisher()
}
