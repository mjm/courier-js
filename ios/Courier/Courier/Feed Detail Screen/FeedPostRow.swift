import SwiftUI
import RelaySwiftUI
import CourierGenerated
import SwiftSoup

private let postFragment = graphql("""
fragment FeedPostRow_post on Post {
    id
    url
    title
    htmlContent
    publishedAt
}
""")

struct FeedPostRow: View {
    @Fragment<FeedPostRow_post> var post

    var body: some View {
        if let post = post {
            VStack(alignment: .leading, spacing: 6) {
                if !post.title.isEmpty {
                    Text(post.title)
                        .font(.headline)
                } else {
                    Text((try? SwiftSoup.parse(post.htmlContent).text()) ?? post.htmlContent)
                        .font(.body)
                        .lineLimit(2)
                }

                if let publishedAt = post.publishedAt?.asDate {
                    (Text("Posted ") + Text(publishedAt, style: .relative) + Text(" ago"))
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            .padding(.vertical, 8.0)
        }
    }
}

private let previewQuery = graphql("""
query FeedPostRowPreviewQuery {
    feed(id: "foo") {
        posts {
            edges {
                node {
                    id
                    ...FeedPostRow_post
                }
            }
        }
    }
}
""")

struct FeedPostRow_Previews: PreviewProvider {
    static let op = FeedPostRowPreviewQuery()

    static var previews: some View {
        QueryPreview(op) { data in
            List {
                Section(header: Text("Recent Posts")) {
                    ForEach(data.feed!.posts.edges.map { $0.node }) { post in
                        FeedPostRow(post: post.asFragment())
                    }
                }
            }
            .listStyle(InsetGroupedListStyle())
        }
        .previewPayload(op, resource: "FeedPostRowPreview")
    }
}
