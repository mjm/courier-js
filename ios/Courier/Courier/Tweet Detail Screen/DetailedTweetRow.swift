import SwiftUI
import RelaySwiftUI
import CourierGenerated

private let tweetFragment = graphql("""
fragment DetailedTweetRow_tweet on Tweet {
  body
  mediaURLs
}
""")

struct DetailedTweetRow: View {
    @Fragment<DetailedTweetRow_tweet> var tweet

    var body: some View {
        if let tweet = tweet {
            VStack(alignment: .leading, spacing: 8) {
                LinkedText(tweet.body)
                    .font(.body)

                AsyncImageGrid(
                    urls: tweet.mediaURLs.compactMap { URL(string: $0) },
                    placeholder: { ImagePlaceholder() }
                )
            }
            .padding(.vertical, 4)
        }
    }
}
