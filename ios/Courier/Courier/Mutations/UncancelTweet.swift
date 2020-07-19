import Relay
import RelaySwiftUI
import CourierGenerated

private let mutation = graphql("""
mutation UncancelTweetMutation($input: UncancelTweetInput!) {
  uncancelTweet(input: $input) {
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

    let data = try! SelectorDataDecoder().decode(UncancelTweetMutation.Data.self, from: selectorData)
    moveTweetGroup(&store, id: data.uncancelTweet.tweetGroup.id, from: .past, to: .upcoming)
}

extension Mutation.Mutator where Operation == UncancelTweetMutation {
    func commit(id: String) {
        commit(
            variables: .init(input: UncancelTweetInput(id: id)),
            optimisticResponse: [
                "uncancelTweet": [
                    "tweetGroup": [
                        "id": id,
                        "status": "DRAFT",
                    ]
                ]
            ],
            optimisticUpdater: updater,
            updater: updater
        )
    }
}
