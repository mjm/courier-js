import SwiftUI
import RelaySwiftUI

private let tweetFragment = graphql("""
fragment DetailedTweetRow_tweet on Tweet {
  body
  mediaURLs
}
""")

struct DetailedTweetRow: View {
    let tweet: DetailedTweetRow_tweet_Key

    var body: some View {
        RelayFragment(fragment: DetailedTweetRow_tweet(), key: tweet, content: Content.init)
    }

    struct Content: View {
        let data: DetailedTweetRow_tweet.Data?

        var body: some View {
            Group {
                if data == nil {
                    EmptyView()
                } else {
                    VStack {
                        Text(data!.body)
                            .font(.body)
                    }.padding(.vertical, 4)
                }
            }
        }
    }
}
