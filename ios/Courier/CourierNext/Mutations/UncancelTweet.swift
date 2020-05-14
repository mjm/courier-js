import Relay
import RelaySwiftUI

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

extension Mutation.Mutator where O == UncancelTweetMutation {
    func commit(id: String) {
        commit(variables: .init(input: UncancelTweetInput(id: id)))
    }
}
