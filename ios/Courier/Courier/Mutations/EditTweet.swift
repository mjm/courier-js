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

extension Mutation.Mutator where Operation == EditTweetMutation {
    func commit(_ input: EditTweetInput) {
        commit(
            variables: .init(input: input),
            optimisticResponse: [
                "editTweet": [
                    "tweetGroup": [
                        "id": input.id,
                        "tweets": input.tweets.map { tweet in
                            [
                                "body": tweet.body,
                                "mediaURLs": tweet.mediaURLs ?? [],
                            ]
                        }
                    ]
                ]
            ]
        )
    }
}
