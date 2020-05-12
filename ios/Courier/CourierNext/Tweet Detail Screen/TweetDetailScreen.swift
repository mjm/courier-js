import SwiftUI
import RelaySwiftUI

private let query = graphql("""
query TweetDetailScreenQuery($id: ID!) {
  tweetGroup(id: $id) {
    id
    status
    action
    tweets {
      __typename
    }
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
            loadingContent: LoadingView(text: "Loading tweet details…"),
            errorContent: ErrorView.init
        ) { data in
            Group {
                if data?.tweetGroup == nil {
                    Spacer()
                        .navigationBarTitle("Loading…")
                } else {
                    List {
                        DetailedTweetList(tweetGroup: data!.tweetGroup!)
                    }
                        .listStyle(GroupedListStyle())
                        .navigationBarTitle(data!.tweetGroup!.tweets.count > 1 ? "Tweet Thread" : "Tweet")
                }
            }
        }
    }
}
