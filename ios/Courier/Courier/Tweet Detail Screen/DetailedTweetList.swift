import SwiftUI
import RelaySwiftUI

private let tweetGroupFragment = graphql("""
fragment DetailedTweetList_tweetGroup on TweetGroup {
  tweets {
    body
    ...DetailedTweetRow_tweet
  }
}
""")

struct DetailedTweetList: View {
    @Fragment<DetailedTweetList_tweetGroup> var tweetGroup

    @ViewBuilder var body: some View {
        if let tweetGroup = tweetGroup {
            Section(header: headerView) {
                ForEach(tweetGroup.tweets, id: \.body) { tweet in
                    DetailedTweetRow(tweet: tweet.asFragment())
                }
            }
        }
    }

    @ViewBuilder var headerView: some View {
        if tweetGroup!.tweets.count > 1 {
            Text("Thread with \(tweetGroup!.tweets.count) tweets")
        }
    }
}
