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
    let tweetGroup: DetailedTweetList_tweetGroup_Key

    var body: some View {
        RelayFragment(fragment: DetailedTweetList_tweetGroup(), key: tweetGroup, content: Content.init)
    }

    struct Content: View {
        let data: DetailedTweetList_tweetGroup.Data?

        var body: some View {
            Group {
                if data == nil {
                    EmptyView()
                } else {
                    Section(header: headerView) {
                        ForEach(data!.tweets, id: \.body) { tweet in
                            DetailedTweetRow(tweet: tweet)
                        }
                    }
                }
            }
        }

        var headerView: some View {
            Group {
                if data!.tweets.count > 1 {
                    Text("Thread with \(data!.tweets.count) tweets")
                } else {
                    EmptyView()
                }
            }
        }
    }
}
