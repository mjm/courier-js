import SwiftUI
import RelaySwiftUI

private let tweetGroupFragment = graphql("""
fragment TweetRow_tweetGroup on TweetGroup {
  id
  status
  postedAt
  postAfter
  tweets {
    body
    mediaURLs
  }
}
""")

struct TweetRow: View {
    @Fragment<TweetRow_tweetGroup> var tweetGroup
    @Binding var selectedTweetID: String?
    var now = Date()

    var body: some View {
        if let tweetGroup = tweetGroup {
            VStack(alignment: .leading, spacing: 12) {
                statusBadge(tweetGroup)

                ForEach(tweetGroup.tweets, id: \.body) { tweet in
                    tweetContent(tweet)
                }
            }
            .padding(.vertical, 8)
        }
    }

    @ViewBuilder private func tweetContent(_ tweet: TweetRow_tweetGroup.Data.Tweet_tweets) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            LinkedText(tweet.body)
                .font(.body)

            AsyncImageGrid(
                urls: tweet.mediaURLs.compactMap { URL(string: $0) },
                placeholder: { ImagePlaceholder() }
            )
        }
    }

    @ViewBuilder private func statusBadge(_ tweetGroup: TweetRow_tweetGroup.Data) -> some View {
        switch tweetGroup.status {
        case .canceled:
            Badge(label: Text("Canceled"),
                  image: Image(systemName: "trash.fill"))
        case .posted:
            Badge(label: postedAtTimeText(tweetGroup),
                  image: Image(systemName: "checkmark.circle.fill"),
                  color: .purple)
        case .draft:
            if let postAfter = tweetGroup.postAfter {
                Badge(label: Text("Posting ") + Text(verbatim: "\(postAfter.asDate!, relativeTo: now)"),
                      image: Image(systemName: "clock.fill"),
                      color: .purple)
            } else {
                Badge(label: Text("Draft"),
                      image: Image(systemName: "questionmark.folder.fill"),
                      color: .green)
            }
        }
    }

    private func postedAtTimeText(_ tweetGroup: TweetRow_tweetGroup.Data) -> Text {
        Text("Posted ") + (tweetGroup.postedAt?.asDate.map { date in
            Text(verbatim: "\(date, relativeTo: now)")
        } ?? Text("some unknown time ago"))
    }
}

extension String {
    private static let isoFormatter = ISO8601DateFormatter()

    var asDate: Date? {
        String.isoFormatter.date(from: self)
    }

    func reformatTime(formatter: DateFormatter) -> String? {
        asDate.map { formatter.string(from: $0) }
    }
}

let defaultRelativeTimeFormatter: RelativeDateTimeFormatter = {
    let formatter = RelativeDateTimeFormatter()
    formatter.dateTimeStyle = .named
    return formatter
}()

extension String.StringInterpolation {
    mutating func appendInterpolation(_ value: Date, relativeTo other: Date, formatter: RelativeDateTimeFormatter = defaultRelativeTimeFormatter) {
        appendLiteral(formatter.localizedString(for: value, relativeTo: other))
    }
}

private let previewQuery = graphql("""
query TweetRowPreviewQuery {
    draftTweet: tweetGroup(id: "draft_tweet_id") {
        ...TweetRow_tweetGroup
    }
    autopostingTweet: tweetGroup(id: "autoposting_tweet_id") {
        ...TweetRow_tweetGroup
    }
    canceledTweet: tweetGroup(id: "canceled_tweet_id") {
        ...TweetRow_tweetGroup
    }
    postedTweet: tweetGroup(id: "posted_tweet_id") {
        ...TweetRow_tweetGroup
    }
}
""")

struct TweetRow_Previews: PreviewProvider {
    static let op = TweetRowPreviewQuery()
    static let now = Date(timeIntervalSinceReferenceDate: 0)

    static var previews: some View {
        QueryPreview(op) { data in
            List {
                TweetRow(tweetGroup: data.draftTweet!.asFragment(), selectedTweetID: .constant(nil), now: now)
                TweetRow(tweetGroup: data.autopostingTweet!.asFragment(), selectedTweetID: .constant(nil), now: now)
                TweetRow(tweetGroup: data.canceledTweet!.asFragment(), selectedTweetID: .constant(nil), now: now)
                TweetRow(tweetGroup: data.postedTweet!.asFragment(), selectedTweetID: .constant(nil), now: now)
            }
        }.previewPayload(op, resource: "TweetRowPreview")
    }
}
