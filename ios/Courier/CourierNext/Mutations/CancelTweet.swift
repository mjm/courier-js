import Relay

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
