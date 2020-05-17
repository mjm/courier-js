import SwiftUI
import RelaySwiftUI

private let tweetGroupFragment = graphql("""
fragment ViewTweet_tweetGroup on TweetGroup {
  status
  ...DetailedTweetList_tweetGroup
  ...DetailedTweetActions_tweetGroup
}
""")

struct ViewTweet: View {
    @Fragment(ViewTweet_tweetGroup.self) var tweetGroup
    @Binding var isEditing: Bool

    init(tweetGroup: ViewTweet_tweetGroup_Key, isEditing: Binding<Bool>) {
        self._isEditing = isEditing
        self.$tweetGroup = tweetGroup
    }

    var body: some View {
        Group {
            if tweetGroup != nil {
                Form {
                    DetailedTweetList(tweetGroup: tweetGroup!)
                    DetailedTweetActions(tweetGroup: tweetGroup!)
                }
                .navigationBarItems(leading: EmptyView(), trailing: Group {
                    if tweetGroup!.status == .draft {
                        Button("Edit") { self.isEditing = true }
                    }
                })
            }
        }
    }
}
