import Relay
import RelaySwiftUI
import CourierGenerated

private let mutation = graphql("""
mutation AddFeedMutation($input: AddFeedInput!) {
  addFeed(input: $input) {
    feedEdge {
      node {
        ...FeedRow_feed
      }
      cursor
    }
  }
}
""")

private let updater: SelectorStoreUpdater = { store, data in
    let handler = ConnectionHandler.default
    guard
        let viewer = store.root.getLinkedRecord("viewer"),
        var feeds = handler.getConnection(viewer, key: "FeedsSection_allFeeds"),
        let newEdge = store.getRootField("addFeed")?.getLinkedRecord("feedEdge")
    else {
        return
    }

    handler.insert(connection: &feeds, edge: newEdge, after: nil)
}

extension Mutation.Mutator where Operation == AddFeedMutation {
    func commit(url: String, completion: ((Result<AddFeedMutation.Data?, Error>) -> Void)? = nil) {
        commit(
            variables: .init(input: .init(url: url)),
            updater: updater,
            completion: completion
        )
    }
}
