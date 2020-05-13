import SwiftUI
import RelaySwiftUI

private let tweetFragment = graphql("""
fragment DetailedTweetRow_tweet on Tweet {
  body
  mediaURLs
}
""")

struct DetailedTweetRow: View {
    @Fragment(DetailedTweetRow_tweet.self) var tweet

    init(tweet: DetailedTweetRow_tweet_Key) {
        self.tweet = tweet
    }

    var body: some View {
        Group {
            if $tweet == nil {
                EmptyView()
            } else {
                VStack {
                    Text($tweet!.body)
                        .font(.body)
                }.padding(.vertical, 4)
            }
        }
    }
}
