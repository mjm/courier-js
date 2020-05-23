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
    @EnvironmentObject var screenCoordinator: ScreenCoordinator

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
                        TweetRow(tweetGroup: tweet, selectedTweetID: self.$screenCoordinator.selectedTweetID)
                    }

                    pagingView
                }.overlay(navigationOverlay)
            }
        }
    }

    var navigationOverlay: some View {
        Group {
            if screenCoordinator.selectedTweetID != nil {
                NavigationLink(
                    destination: TweetDetailScreen(id: screenCoordinator.selectedTweetID!),
                    tag: screenCoordinator.selectedTweetID!,
                    selection: $screenCoordinator.selectedTweetID
                ) {
                    EmptyView()
                }
            }
        }.allowsHitTesting(false)
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

    var pagingView: some View {
        Group {
            if paging.isLoadingNext {
                Text("Loading…")
                    .foregroundColor(.secondary)
                    .frame(maxWidth: .infinity, alignment: .center)
                    .padding(.vertical, 20)
            } else if paging.hasNext {
                Button(action: {
                    self.paging.loadNext(10)
                }, label: {
                    Text("Load more tweets…")
                        .fontWeight(.bold)
                        .foregroundColor(.secondary)
                        .frame(maxWidth: .infinity, alignment: .center)
                        .padding(.vertical, 20)
                }).onAppear(delay: 0.3) {
                    self.paging.loadNext(10)
                }
            }
        }
    }
}
