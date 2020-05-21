import SwiftUI
import RelaySwiftUI

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
    @Fragment(EditTweetForm_tweetGroup.self) var tweetGroup
    @Binding var isEditing: Bool

    init(tweetGroup: EditTweetForm_tweetGroup_Key, isEditing: Binding<Bool>) {
        self._isEditing = isEditing
        self.$tweetGroup = tweetGroup
    }

    var body: some View {
        Group {
            if tweetGroup != nil {
                EditTweetList(tweetGroup: tweetGroup!, isEditing: $isEditing)
            }
        }
    }
}
