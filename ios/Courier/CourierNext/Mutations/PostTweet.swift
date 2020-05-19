import Relay
import RelaySwiftUI

private let mutation = graphql("""
mutation PostTweetMutation($input: PostTweetInput!) {
  postTweet(input: $input) {
    tweetGroup {
      id
      tweets {
        body
        mediaURLs
        postedTweetID
      }
      status
      postedAt
      postAfter
    }
  }
}
""")

extension Mutation.Mutator where Operation == PostTweetMutation {
    func commit(id: String) {
        commit(variables: .init(input: PostTweetInput(id: id)))
    }
}
