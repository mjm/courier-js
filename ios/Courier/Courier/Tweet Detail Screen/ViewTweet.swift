import SwiftUI
import RelaySwiftUI
import CourierGenerated

private let tweetGroupFragment = graphql("""
fragment ViewTweet_tweetGroup on TweetGroup {
  status
  ...DetailedTweetList_tweetGroup
  ...DetailedTweetActions_tweetGroup
}
""")

struct ViewTweet: View {
    @Fragment<ViewTweet_tweetGroup> var tweetGroup
    @Binding var isEditing: Bool

    init(tweetGroup: Fragment<ViewTweet_tweetGroup>, isEditing: Binding<Bool>) {
        self._tweetGroup = tweetGroup
        self._isEditing = isEditing
    }

    @ViewBuilder var body: some View {
        if let tweetGroup = tweetGroup {
            #if os(iOS)
            Form {
                DetailedTweetList(tweetGroup: tweetGroup.asFragment())
                DetailedTweetActions(tweetGroup: tweetGroup.asFragment())
            }
            .navigationBarItems(leading: EmptyView(), trailing: Group {
                if tweetGroup.status == .draft {
                    Button("Edit") { isEditing = true }
                }
            })
            #else
            Form {
                DetailedTweetList(tweetGroup: tweetGroup.asFragment())
                DetailedTweetActions(tweetGroup: tweetGroup.asFragment())
            }
            #endif
        }
    }
}
