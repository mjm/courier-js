import Relay
import RelaySwiftUI
import CourierGenerated

private let mutation = graphql("""
mutation DeleteFeedMutation($input: DeleteFeedInput!) {
    deleteFeed(input: $input) {
        id
    }
}
""")

private let updater: SelectorStoreUpdater = { store, data in
    let handler = ConnectionHandler.default
    guard
        let viewer = store.root.getLinkedRecord("viewer"),
        var feeds = handler.getConnection(viewer, key: "FeedsSection_allFeeds"),
        let deletedID = store.getRootField("deleteFeed")?["id"] as? String
    else {
        return
    }

    handler.delete(connection: &feeds, nodeID: DataID(deletedID))
}

extension Mutation.Mutator where Operation == DeleteFeedMutation {
    func commit(id: String) {
        commit(
            variables: .init(input: .init(id: id)),
            optimisticResponse: [
                "deleteFeed": [
                    "id": id,
                ],
            ],
            optimisticUpdater: updater,
            updater: updater
        )
    }
}
