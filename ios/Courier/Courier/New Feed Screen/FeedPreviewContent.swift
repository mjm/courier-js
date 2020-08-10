import SwiftUI
import RelaySwiftUI
import CourierGenerated

private let query = graphql("""
query FeedPreviewContentQuery($url: String!) {
    feedPreview(url: $url) {
        url
        title
        tweets {
            ...TweetRow_tweetGroup
        }
    }
}
""")

struct FeedPreviewContent: View {
    @Query<FeedPreviewContentQuery>(fetchPolicy: .storeAndNetwork) var query

    let url: String
    @Binding var canSave: Bool

    var body: some View {
        Group {
            if !url.isEmpty {
                switch query.get(url: url) {
                case .loading:
                    LoadingView(text: "Checking feed…")
                        .padding()
                        .frame(maxWidth: .infinity)
                case .failure(let error):
                    ErrorView(error: error)
                case .success(let data):
                    if let preview = data?.feedPreview {
                        Section(
                            header: VStack(alignment: .leading, spacing: 4) {
                                Text(preview.title)
                                    .font(.headline)
                                    .textCase(.none)

                                Text(preview.url)
                                    .textCase(.none)
                            }
                            .padding(.bottom, 8)
                            .padding(.top)
                        ) {
                            ForEach(0..<preview.tweets.count, id: \.self) { idx in
                                let tweet = preview.tweets[idx]

                                TweetRow(tweetGroup: tweet.asFragment(), selectedTweetID: .constant(nil))
                            }
                        }
                        .onAppear { canSave = true }
                        .onDisappear { canSave = false }
                    } else {
                        Text("No feed found to preview.")
                    }
                }
            }
        }
    }
}

struct FeedPreviewContent_Previews: PreviewProvider {
    static let op = FeedPreviewContentQuery(url: "https://www.mattmoriarity.com")

    static var previews: some View {
        NavigationView {
            Form {
                FeedPreviewContent(url: "https://www.mattmoriarity.com", canSave: .constant(false))
            }
        }
        .previewPayload(op, resource: "FeedPreviewContentPreview")
    }
}
