import SwiftUI
import RelaySwiftUI

private let query = graphql("""
query TweetDetailScreenQuery($id: ID!) {
  tweetGroup(id: $id) {
    id
    status
    action
    ...DetailedTweetList_tweetGroup
  }
}
""")

struct TweetDetailScreen: View {
    let id: String

    var body: some View {
        RelayQuery(
            op: TweetDetailScreenQuery(),
            variables: .init(id: id),
            loadingContent: Text("Loading…"),
            errorContent: { Text($0.localizedDescription) }
        ) { data in
            Group {
                if data?.tweetGroup == nil {
                    Spacer()
                } else {
                    List {
                        DetailedTweetList(tweetGroup: data!.tweetGroup!)
                    }.listStyle(GroupedListStyle())
                }
            }.navigationBarTitle("Tweet Group")
        }
    }
}
