import SwiftUI
import RelaySwiftUI

private let tweetGroupFragment = graphql("""
fragment TweetRow_tweetGroup on TweetGroup {
  id
  status
  postedAt
  tweets {
    body
    mediaURLs
  }
}
""")

struct TweetRow: View {
    let tweetGroup: TweetRow_tweetGroup_Key

    var body: some View {
        RelayFragment(fragment: TweetRow_tweetGroup(), key: tweetGroup, content: Content.init)
    }

    struct Content: View {
        let data: TweetRow_tweetGroup.Data?

        private let relativeTimeFormatter: RelativeDateTimeFormatter = {
            let formatter = RelativeDateTimeFormatter()
            formatter.dateTimeStyle = .named
            return formatter
        }()

        var body: some View {
            Group {
                if data == nil {
                    EmptyView()
                } else {
                    NavigationLink(destination: TweetDetailScreen(id: data!.id)) {
                        VStack(alignment: .leading, spacing: 12) {
                            ForEach(data!.tweets, id: \.body) { tweet in
                                VStack(alignment: .leading, spacing: 8) {
                                    LinkedText(tweet.body)
                                        .font(.body)
                                    AsyncImageGrid(
                                        urls: tweet.mediaURLs.compactMap { URL(string: $0) },
                                        placeholder: { ImagePlaceholder() }
                                    )
                                }
                            }

                            if data!.status == .canceled {
                                Text("Canceled")
                                    .font(Font.caption.italic())
                                    .foregroundColor(.secondary)
                            } else if data!.status == .posted {
                                postedAtTimeText
                                    .font(Font.caption.italic())
                                    .foregroundColor(.secondary)
                            }
                        }.padding(.vertical, 4)
                    }
                }
            }
        }

        private var postedAtTimeText: Text {
            Text("Posted ") + (data!.postedAt?.asDate.map { date in
                Text(relativeTimeFormatter.localizedString(for: date, relativeTo: Date()))
            } ?? Text("some unknown time"))
        }
    }
}

extension Time {
    private static let isoFormatter = ISO8601DateFormatter()

    var asDate: Date? {
        Time.isoFormatter.date(from: self)
    }

    func reformatTime(formatter: DateFormatter) -> String? {
        asDate.map { formatter.string(from: $0) }
    }
}
