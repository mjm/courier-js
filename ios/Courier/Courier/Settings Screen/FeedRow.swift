import SwiftUI
import RelaySwiftUI
import CourierGenerated

private let feedFragment = graphql("""
fragment FeedRow_feed on Feed {
    id
    title
    homePageURL
    refreshedAt
    refreshing
    autopost
}
""")

struct FeedRow: View {
    @Fragment<FeedRow_feed> var feed

    var body: some View {
        if let feed = feed {
            NavigationLink(destination: FeedDetailScreen(id: feed.id)) {
                VStack(alignment: .leading, spacing: 4.0) {
                    Text(feed.title)
                        .font(.headline)
                        .lineLimit(1)
                    Text(feed.homePageURL)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                .padding(.vertical, 6.0)
            }
        }
    }
}

private let previewQuery = graphql("""
query FeedRowPreviewQuery {
    viewer {
        allFeeds {
            edges {
                node {
                    id
                    ...FeedRow_feed
                }
            }
        }
    }
}
""")

struct FeedRow_Previews: PreviewProvider {
    static let op = FeedRowPreviewQuery()

    static var previews: some View {
        QueryPreview(op) { data in
            NavigationView {
                List(data.viewer!.allFeeds.edges.map { $0.node }) { feed in
                    FeedRow(feed: feed.asFragment())
                }
                .listStyle(InsetGroupedListStyle())
                .navigationTitle("Your Feeds")
            }
        }
        .previewPayload(op, resource: "FeedsSectionPreview")
    }
}
