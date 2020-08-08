import Combine
import Relay
import CourierGenerated

struct FeedRefreshedEvent: Decodable {
    var userID: String
    var feedID: String

    enum CodingKeys: String, CodingKey {
        case userID = "user_id"
        case feedID = "feed_id"
    }
}

private let query = graphql("""
query FeedRefreshedEventQuery($id: ID!) {
  feed(id: $id) {
    id
    title
    homePageURL
    micropubEndpoint
    refreshedAt
    refreshing
  }
}
""")

func handleFeedRefreshed(_ environment: Environment, _ event: FeedRefreshedEvent) -> AnyPublisher<Never, Error> {
    environment.fetchQuery(FeedRefreshedEventQuery(variables: .init(id: event.feedID)))
        .ignoreOutput()
        .eraseToAnyPublisher()
}
