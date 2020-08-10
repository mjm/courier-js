import SwiftUI
import RelaySwiftUI
import CourierGenerated

private let feedsFragment = graphql("""
fragment FeedsSection_feeds on Viewer
  @refetchable(queryName: "FeedsSectionPaginationQuery")
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 10 }
    cursor: { type: "Cursor" }
  ) {
  allFeeds(first: $count, after: $cursor)
    @connection(key: "FeedsSection_allFeeds") {
    edges {
      node {
        id
        ...FeedRow_feed
      }
    }
  }
}
""")

struct FeedsSection: View {
    @PaginationFragment<FeedsSection_feeds> var feeds

    @State private var isNewFeedPresented = false

    var body: some View {
        if let feeds = feeds {
            Section(header: Text("Your Feeds")) {
                ForEach(feeds.allFeeds) { feed in
                    FeedRow(feed: feed.asFragment())
                }

                NavigationLink(
                    destination: NewFeedScreen(isPresented: $isNewFeedPresented),
                    isActive: $isNewFeedPresented
                ) {
                    Label("Watch New Feed", systemImage: "plus")
                        .foregroundColor(.accentColor)
                }
            }
        }
    }
}

private let previewQuery = graphql("""
query FeedsSectionPreviewQuery {
    viewer {
        ...FeedsSection_feeds
    }
}
""")

struct FeedsSection_Previews: PreviewProvider {
    static let op = FeedsSectionPreviewQuery()

    static var previews: some View {
        QueryPreview(op) { data in
            NavigationView {
                List {
                    FeedsSection(feeds: data.viewer!.asFragment())
                }
                .listStyle(InsetGroupedListStyle())
                .navigationTitle("Your Feeds")
            }
        }
        .previewPayload(op, resource: "FeedsSectionPreview")
    }
}
