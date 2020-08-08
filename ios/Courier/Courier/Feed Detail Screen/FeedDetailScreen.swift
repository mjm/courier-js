import SwiftUI
import RelaySwiftUI
import CourierGenerated

private let query = graphql("""
query FeedDetailScreenQuery($id: ID!) {
    feed(id: $id) {
        title
        ...FeedInfoSection_feed
    }
}
""")

struct FeedDetailScreen: View {
    @Query<FeedDetailScreenQuery> var query
    let id: String

    var body: some View {
        switch query.get(id: id) {
        case .loading:
            LoadingView(text: "Loading feed…")
        case .failure(let error):
            ErrorView(error: error)
        case .success(let data):
            if let feed = data?.feed {
                List {
                    FeedInfoSection(feed: feed.asFragment())
                }
                .listStyle(InsetGroupedListStyle())
                .navigationTitle(feed.title)
            }
        }
    }
}

//struct FeedDetailScreen_Previews: PreviewProvider {
//    static var previews: some View {
//        FeedDetailScreen()
//    }
//}
