import SwiftUI
import RelaySwiftUI
import CourierGenerated

private let tweetGroupFragment = graphql("""
fragment EditTweetForm_tweetGroup on TweetGroup {
  id
  tweets {
    body
    mediaURLs
  }
}
""")

struct EditTweetForm: View {
    @Fragment<EditTweetForm_tweetGroup> var tweetGroup
    @Binding var isEditing: Bool

    init(tweetGroup: Fragment<EditTweetForm_tweetGroup>, isEditing: Binding<Bool>) {
        self._tweetGroup = tweetGroup
        self._isEditing = isEditing
    }

    @ViewBuilder var body: some View {
        if let tweetGroup = tweetGroup {
            EditTweetList(tweetGroup: tweetGroup, isEditing: $isEditing)
        }
    }
}
