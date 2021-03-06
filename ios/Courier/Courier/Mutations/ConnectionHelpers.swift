import Relay
import CourierGenerated

func moveTweetGroup(
    _ store: inout RecordSourceSelectorProxy,
    id: String,
    from fromFilter: TweetFilter,
    to toFilter: TweetFilter
) {
    let handler = ConnectionHandler.default
    guard let viewer = store.root.getLinkedRecord("viewer") else {
        return
    }

    let tweetGroupID = DataID(id)
    guard let tweetGroup = store[tweetGroupID] else {
        return
    }

    if var fromTweets = handler.getConnection(viewer, key: "TweetsList_allTweets", filters: ["filter": fromFilter]) {
        handler.delete(connection: &fromTweets, nodeID: tweetGroupID)
    }

    if var toTweets = handler.getConnection(viewer, key: "TweetsList_allTweets", filters: ["filter": toFilter]) {
        let edge = handler.createEdge(&store, connection: toTweets, node: tweetGroup, type: "TweetGroupEdge")
        handler.insert(connection: &toTweets, edge: edge, before: nil)
    }
}
