import SwiftUI
import Relay
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
    let tweets: TweetsList_tweets_Key

    var body: some View {
        RelayPaginationFragment(fragment: TweetsList_tweets(), key: tweets, content: Content.init)
    }

    struct Content: View {
        let data: TweetsList_tweets.Data?
        let paging: Paginating

        typealias Tweet = TweetsList_tweets.Data.TweetGroupConnection_allTweets.TweetGroupEdge_edges.TweetGroup_node
        var tweets: [Tweet] {
            data?.allTweets.edges.map { $0.node } ?? []
        }

        var body: some View {
            List {
                ForEach(tweets, id: \.id) { tweet in
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
