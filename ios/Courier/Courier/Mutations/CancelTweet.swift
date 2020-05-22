import Relay
import RelaySwiftUI

private let mutation = graphql("""
mutation CancelTweetMutation($input: CancelTweetInput!) {
  cancelTweet(input: $input) {
    tweetGroup {
      id
      status
    }
  }
}
""")

private func updater(_ store: inout RecordSourceSelectorProxy, _ data: SelectorData?) {
    let handler = ConnectionHandler.default
    guard let data = data, let viewer = store.root.getLinkedRecord("viewer")  else {
        return
    }

    let payload = CancelTweetMutation.Data(from: data)
    let tweetGroupID = DataID(payload.cancelTweet.tweetGroup.id)

    guard let tweetGroup = store[tweetGroupID] else {
        return
    }

    guard var upcomingTweets = handler.getConnection(viewer, key: "TweetsList_allTweets", filters: ["filter": TweetFilter.upcoming]) else {
        return
    }
    handler.delete(connection: &upcomingTweets, nodeID: DataID(payload.cancelTweet.tweetGroup.id))

    guard var pastTweets = handler.getConnection(viewer, key: "TweetsList_allTweets", filters: ["filter": TweetFilter.past]) else {
        return
    }
    var store2 = store as RecordSourceProxy
    let edge = handler.createEdge(&store2, connection: &pastTweets, node: tweetGroup, type: "TweetGroupEdge")
    handler.insert(connection: &pastTweets, edge: edge, before: nil)
}

extension Mutation.Mutator where Operation == CancelTweetMutation {
    func commit(id: String) {
        commit(
            variables: .init(input: CancelTweetInput(id: id)),
            optimisticResponse: [
                "cancelTweet": [
                    "tweetGroup": [
                        "id": id,
                        "status": "CANCELED",
                    ]
                ]
            ],
            optimisticUpdater: updater,
            updater: updater
        )
    }
}
