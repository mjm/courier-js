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

extension Mutation.Mutator where O == CancelTweetMutation {
    func commit(id: String) {
        commit(variables: .init(input: CancelTweetInput(id: id)))
    }
}
