import Relay
import RelaySwiftUI
import CourierGenerated

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
    guard let selectorData = data else {
        return
    }

    let data = try! SelectorDataDecoder().decode(CancelTweetMutation.Data.self, from: selectorData)
    moveTweetGroup(&store, id: data.cancelTweet.tweetGroup.id, from: .upcoming, to: .past)
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
