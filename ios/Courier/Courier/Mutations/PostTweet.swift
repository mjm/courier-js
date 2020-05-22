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

private func updater(_ store: inout RecordSourceSelectorProxy, _ data: SelectorData?) {
    guard let data = data.map(PostTweetMutation.Data.init) else {
        return
    }

    // This isn't really right, is it? Posted tweets don't move right away because they
    // post in the background, but this is fine for now.
    moveTweetGroup(&store, id: data.postTweet.tweetGroup.id, from: .upcoming, to: .past)
}

extension Mutation.Mutator where Operation == PostTweetMutation {
    func commit(id: String) {
        commit(
            variables: .init(input: PostTweetInput(id: id)),
            updater: updater
        )
    }
}
