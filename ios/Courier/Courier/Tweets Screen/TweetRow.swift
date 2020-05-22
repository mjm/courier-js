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
    @Fragment(TweetRow_tweetGroup.self) var tweetGroup
    @Binding var selectedTweetID: String?

    init(tweetGroup: TweetRow_tweetGroup_Key, selectedTweetID: Binding<String?>) {
        _selectedTweetID = selectedTweetID
        $tweetGroup = tweetGroup
    }

    var body: some View {
        Group {
            if tweetGroup != nil {
                Button(action: { self.selectedTweetID = self.tweetGroup!.id }) {
                    VStack(alignment: .leading, spacing: 12) {
                        ForEach(tweetGroup!.tweets, id: \.body) { tweet in
                            VStack(alignment: .leading, spacing: 8) {
                                LinkedText(tweet.body)
                                    .font(.body)
                                AsyncImageGrid(
                                    urls: tweet.mediaURLs.compactMap { URL(string: $0) },
                                    placeholder: { ImagePlaceholder() }
                                )
                            }
                        }

                        if tweetGroup!.status == .canceled {
                            Text("Canceled")
                                .font(Font.caption.italic())
                                .foregroundColor(.secondary)
                        } else if tweetGroup!.status == .posted {
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
        Text("Posted ") + (tweetGroup!.postedAt?.asDate.map { date in
            Text(verbatim: "\(date, relativeTo: Date())")
        } ?? Text("some unknown time"))
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
