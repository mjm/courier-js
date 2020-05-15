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
    ...DetailedTweetActions_tweetGroup
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
            errorContent: { ErrorView(error: $0) },
            dataContent: Inner.init
        )
    }

    // Inner view is important, if the editing @State is in the same view as the RelayQuery,
    // weird things happen when we tap the button. The view reverts to the loading state
    // permanently for some reason.
    struct Inner: View {
        let data: TweetDetailScreenQuery.Data?

        @State private var isEditing = false

        var body: some View {
            Group {
                if data?.tweetGroup == nil {
                    Spacer()
                        .navigationBarTitle("Loading…")
                } else {
                    List {
                        if isEditing {
                            Text("It's editing time!")
                        } else {
                            DetailedTweetList(tweetGroup: data!.tweetGroup!)
                            DetailedTweetActions(tweetGroup: data!.tweetGroup!)
                        }
                    }
                        .listStyle(GroupedListStyle())
                        .navigationBarTitle(data!.tweetGroup!.tweets.count > 1 ? "Tweet Thread" : "Tweet")
                        .navigationBarItems(trailing: Group {
                            if data!.tweetGroup!.status == .draft {
                                Button(self.isEditing ? "Done" : "Edit") {
                                    self.isEditing.toggle()
                                }
                            } else {
                                EmptyView()
                            }
                        })
                    }
            }
        }
    }
}
