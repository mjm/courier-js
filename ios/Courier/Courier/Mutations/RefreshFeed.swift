import RelaySwiftUI
import CourierGenerated

private let mutation = graphql("""
mutation RefreshFeedMutation($input: RefreshFeedInput!) {
  refreshFeed(input: $input) {
    feed {
      id
      refreshing
    }
  }
}
""")

extension Mutation.Mutator where Operation == RefreshFeedMutation {
    func commit(id: String) {
        commit(
            variables: .init(input: .init(id: id)),
            optimisticResponse: [
                "refreshFeed": [
                    "feed": [
                        "id": id,
                        "refreshing": true,
                    ]
                ]
            ]
        )
    }
}
