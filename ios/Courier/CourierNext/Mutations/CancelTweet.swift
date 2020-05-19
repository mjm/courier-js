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
            ]
        )
    }
}
