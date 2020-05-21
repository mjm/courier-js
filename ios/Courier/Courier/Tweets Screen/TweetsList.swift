import SwiftUI
import RelaySwiftUI

private let tweetsFragment = graphql("""
fragment TweetsList_tweets on Viewer
  @refetchable(queryName: "TweetsListPaginationQuery")
  @argumentDefinitions(
    filter: { type: "TweetFilter" }
    count: { type: "Int", defaultValue: 10 }
    cursor: { type: "Cursor" }
  ) {
  allTweets(filter: $filter, first: $count, after: $cursor)
    @connection(key: "TweetsList_allTweets") {
    edges {
      node {
        id
        ...TweetRow_tweetGroup
      }
    }
  }
}
""")

struct TweetsList: View {
    @PaginationFragment(TweetsList_tweets.self) var tweets
    let filter: TweetFilter

    init(tweets: TweetsList_tweets_Key, filter: TweetFilter) {
        self.filter = filter
        self.$tweets = tweets
    }

    typealias Tweet = TweetsList_tweets.Data.TweetGroupConnection_allTweets.TweetGroupEdge_edges.TweetGroup_node

    var tweetNodes: [Tweet] {
        tweets?.allTweets.edges.map { $0.node } ?? []
    }

    var paging: Paginating { tweets! }
    
    var body: some View {
        Group {
            if tweets == nil {
                Spacer()
            } else if tweetNodes.isEmpty {
                emptyView
            } else {
                List {
                    ForEach(tweetNodes, id: \.id) { tweet in
                        TweetRow(tweetGroup: tweet)
                            .padding(.vertical, 4)
                    }

                    if paging.isLoadingNext {
                        Text("Loading…").foregroundColor(.secondary)
                    } else if paging.hasNext {
                        Button("Load more tweets…") {
                            self.paging.loadNext(10)
                        }.onAppear { self.paging.loadNext(10) }
                    }
                }
            }
        }
    }

    var emptyView: some View {
        VStack {
            Image(systemName: "tray")
                .font(.system(size: 40))
                .padding(.bottom, 10)
            Text(filter == .upcoming ? "You don't have any upcoming tweets to review." : "You haven't posted any tweets with Courier yet.")
                .font(.body)
                .multilineTextAlignment(.center)
        }
            .foregroundColor(.secondary)
            .padding(.bottom, 150)
            .padding(.horizontal, 30)
    }
}
