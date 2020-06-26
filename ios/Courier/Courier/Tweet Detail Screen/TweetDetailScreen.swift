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
    let id: String

    @Query(TweetDetailScreenQuery.self) var tweet
    @State private var isEditing = false

    var body: some View {
        Group {
            switch tweet.get(.init(id: id)) {
            case .loading:
                LoadingView(text: "Loading tweet details…")
            case .failure(let error):
                ErrorView(error: error)
            case .success(let data):
                if let tweetGroup = data?.tweetGroup {
                    Group {
                        if isEditing {
                            EditTweetForm(tweetGroup: tweetGroup, isEditing: $isEditing)
                        } else {
                            ViewTweet(tweetGroup: tweetGroup, isEditing: $isEditing)
                        }
                    }
                    .navigationBarTitle(tweetGroup.tweets.count > 1 ? "Tweet Thread" : "Tweet")
                } else {
                    Spacer()
                        .navigationBarTitle("Loading…")
                }
            }
        }
    }

    static func ==(lhs: TweetDetailScreen, rhs: TweetDetailScreen) -> Bool {
        lhs.id == rhs.id
    }
}
