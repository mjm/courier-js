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
    @Fragment(DetailedTweetList_tweetGroup.self) var tweetGroup

    init(tweetGroup: DetailedTweetList_tweetGroup_Key) {
        self.$tweetGroup = tweetGroup
    }

    var body: some View {
        Group {
            if tweetGroup == nil {
                EmptyView()
            } else {
                Section(header: headerView) {
                    ForEach(tweetGroup!.tweets, id: \.body) { tweet in
                        DetailedTweetRow(tweet: tweet)
                    }
                }
            }
        }
    }

    var headerView: some View {
        Group {
            if tweetGroup!.tweets.count > 1 {
                Text("Thread with \(tweetGroup!.tweets.count) tweets")
            } else {
                EmptyView()
            }
        }
    }
}
