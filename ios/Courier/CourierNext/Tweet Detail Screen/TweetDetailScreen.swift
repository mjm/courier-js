import SwiftUI
import RelaySwiftUI

private let query = graphql("""
query TweetDetailScreenQuery($id: ID!) {
  tweetGroup(id: $id) {
    id
    tweets {
      __typename
    }
    ...ViewTweet_tweetGroup
    ...EditTweetForm_tweetGroup
  }
}
""")

struct TweetDetailScreen: View, Equatable {
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
                Group {
                    if isEditing {
                        EditTweetForm(tweetGroup: tweet.data!.tweetGroup!, isEditing: $isEditing)
                    } else {
                        ViewTweet(tweetGroup: tweet.data!.tweetGroup!, isEditing: $isEditing)
                    }
                }
                    .navigationBarTitle(tweet.data!.tweetGroup!.tweets.count > 1 ? "Tweet Thread" : "Tweet")
            }
        }
    }

    static func ==(lhs: TweetDetailScreen, rhs: TweetDetailScreen) -> Bool {
        lhs.$tweet.id == rhs.$tweet.id
    }
}
