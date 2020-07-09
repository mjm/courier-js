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

    @Query<TweetDetailScreenQuery>(fetchPolicy: .storeAndNetwork) var tweet
    @State private var isEditing = false

    init(id: String) {
        self.id = id
    }

    @ViewBuilder var body: some View {
        Group {
            switch tweet.get(id: id) {
            case .loading:
                LoadingView(text: "Loading tweet details…")
            case .failure(let error):
                ErrorView(error: error)
            case .success(let data):
                if let tweetGroup = data?.tweetGroup {
                    Group {
                        if isEditing {
                            EditTweetForm(tweetGroup: tweetGroup.asFragment(), isEditing: $isEditing)
                        } else {
                            ViewTweet(tweetGroup: tweetGroup.asFragment(), isEditing: $isEditing)
                        }
                    }
//                    .navigationTitle(tweetGroup.tweets.count > 1 ? "Tweet Thread" : "Tweet")
                } else {
                    Spacer()
//                        .navigationTitle("Loading…")
                }
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }

    static func ==(lhs: TweetDetailScreen, rhs: TweetDetailScreen) -> Bool {
        lhs.id == rhs.id
    }
}
