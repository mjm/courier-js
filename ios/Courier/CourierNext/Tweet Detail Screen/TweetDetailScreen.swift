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
    @Query(TweetDetailScreenQuery.self) var tweet

    @State private var isEditing = false

    init(id: String) {
        $tweet = .init(id: id)
    }

    var body: some View {
        Group {
            if tweet.isLoading {
                LoadingView(text: "Loading tweet details…")
            } else if tweet.error != nil {
                ErrorView(error: tweet.error!)
            } else if tweet.data?.tweetGroup == nil {
                Spacer()
                    .navigationBarTitle("Loading…")
            } else {
                List {
                    if isEditing {
                        Text("It's editing time!")
                    } else {
                        DetailedTweetList(tweetGroup: tweet.data!.tweetGroup!)
                        DetailedTweetActions(tweetGroup: tweet.data!.tweetGroup!)
                    }
                }
                    .listStyle(GroupedListStyle())
                    .navigationBarTitle(tweet.data!.tweetGroup!.tweets.count > 1 ? "Tweet Thread" : "Tweet")
                    .navigationBarItems(trailing: Group {
                        if tweet.data!.tweetGroup!.status == .draft {
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
