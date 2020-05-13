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

    init(tweets: TweetsList_tweets_Key) {
        self.tweets = tweets
    }

    typealias Tweet = TweetsList_tweets.Data.TweetGroupConnection_allTweets.TweetGroupEdge_edges.TweetGroup_node

    var tweetNodes: [Tweet] {
        $tweets?.allTweets.edges.map { $0.node } ?? []
    }

    var paging: Paginating { $tweets! }
    
    var body: some View {
        List {
            if $tweets != nil {
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
