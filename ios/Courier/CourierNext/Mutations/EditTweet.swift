import Relay
import RelaySwiftUI

private let mutation = graphql("""
mutation EditTweetMutation($input: EditTweetInput!) {
  editTweet(input: $input) {
    tweetGroup {
      id
      tweets {
        body
        mediaURLs
      }
    }
  }
}
""")

extension Mutation.Mutator where O == EditTweetMutation {
    func commit(_ input: EditTweetInput) {
        commit(variables: .init(input: input))
    }
}
