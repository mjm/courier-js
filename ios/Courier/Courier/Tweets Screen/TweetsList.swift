import SwiftUI
import RelaySwiftUI
import CourierGenerated

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
    @PaginationFragment<TweetsList_tweets> var tweets
    let filter: TweetFilter
    @EnvironmentObject var screenCoordinator: ScreenCoordinator

    @ViewBuilder var body: some View {
        if let tweets = tweets {
            if tweets.allTweets.isEmpty {
                emptyView
            } else {
                List {
                    ForEach(tweets.allTweets) { tweet in
                        NavigationLink(
                            destination: TweetDetailScreen(id: tweet.id),
                            tag: tweet.id,
                            selection: $screenCoordinator.selectedTweetID
                        ) {
                            TweetRow(tweetGroup: tweet.asFragment(), selectedTweetID: $screenCoordinator.selectedTweetID)
                        }
                        .tag(tweet.id)
                    }

                    pagingView
                }
                .listStyle(PlainListStyle())
//                .onReceive(screenCoordinator.$selectedTweetID) { tweetID in
//                    selection = tweetID
//                }
//                .overlay(navigationOverlay)
            }
        } else {
            Spacer()
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
            if tweets!.isLoadingNext {
                Text("Loading…")
                    .foregroundColor(.secondary)
                    .frame(maxWidth: .infinity, alignment: .center)
                    .padding(.vertical, 20)
            } else if tweets!.hasNext {
                Button {
                    tweets!.loadNext(10)
                } label: {
                    Text("Load more tweets…")
                        .fontWeight(.bold)
                        .foregroundColor(.secondary)
                        .frame(maxWidth: .infinity, alignment: .center)
                        .padding(.vertical, 20)
                }
//                .onAppear(delay: 0.3) {
//                    tweets?.loadNext(10)
//                }
            }
        }
    }
}
