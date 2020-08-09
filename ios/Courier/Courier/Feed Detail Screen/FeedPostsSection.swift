import SwiftUI
import RelaySwiftUI
import CourierGenerated

private let postsFragment = graphql("""
fragment FeedPostsSection_posts on Feed
    @refetchable(queryName: "FeedPostsSectionPaginationQuery")
    @argumentDefinitions(
      filter: { type: "TweetFilter" }
      count: { type: "Int", defaultValue: 10 }
      cursor: { type: "Cursor" }
    ) {
    posts(first: $count, after: $cursor)
        @connection(key: "FeedPostsSection_posts") {
        edges {
            node {
                id
                ...FeedPostRow_post
            }
        }
    }
}
""")

struct FeedPostsSection: View {
    @PaginationFragment<FeedPostsSection_posts> var posts

    var body: some View {
        if let posts = posts {
            Section(header: Text("Recent Posts")) {
                ForEach(posts.posts) { post in
                    FeedPostRow(post: post.asFragment())
                }
            }
        }
    }
}

//struct FeedPostsSection_Previews: PreviewProvider {
//    static var previews: some View {
//        FeedPostsSection()
//    }
//}
