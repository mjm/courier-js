import SwiftUI
import RelaySwiftUI
import CourierGenerated

private let feedFragment = graphql("""
fragment FeedInfoSection_feed on Feed {
    id
    title
    refreshedAt
    refreshing
    autopost
}
""")

struct FeedInfoSection: View {
    @Fragment<FeedInfoSection_feed> var feed
    @Mutation<RefreshFeedMutation> var refreshFeed
    @Mutation<SetFeedOptionsMutation> var setOptions
    @Mutation<DeleteFeedMutation> var deleteFeed

    // It's important that the toggle binding's state updates in the same
    // run of the event loop, otherwise the UI stutters. An optimistic
    // response doesn't do this, so we use this state for the value to show
    // while the request is in-flight.
    @State private var tempAutopost = false

    @State private var isConfirmingDelete = false

    var body: some View {
        if let feed = feed {
            Section {
                if feed.refreshing {
                    Label {
                        Text("Checking now…")
                    } icon: {
                        Image(systemName: "arrow.triangle.2.circlepath")
                            .spinning()
                            .foregroundColor(.accentColor)
                    }
                } else if let refreshedAt = feed.refreshedAt?.asDate {
                    Button {
                        refreshFeed.commit(id: feed.id)
                    } label: {
                        Label {
                            (Text("Checked ") + Text(refreshedAt, style: .relative) + Text(" ago"))
                                .foregroundColor(.primary)
                        } icon: {
                            Image(systemName: "arrow.triangle.2.circlepath")
                                .foregroundColor(.accentColor)
                        }
                    }
                    .disabled(refreshFeed.isInFlight)
                }

                Toggle("Post automatically", isOn: autopostBinding)
                    .disabled(setOptions.isInFlight)
            }

            Section {
                Button {
                    isConfirmingDelete = true
                } label: {
                    Label("Stop Watching", systemImage: "trash")
                        .foregroundColor(.red)
                }
                .alert(isPresented: $isConfirmingDelete) {
                    Alert(
                        title: Text("Stop Watching Feed"),
                        message: Text("Courier will not import any new posts from this feed."),
                        primaryButton: .destructive(Text("Stop Watching")) {
                            deleteFeed.commit(id: feed.id)
                        },
                        secondaryButton: .cancel()
                    )
                }
            }
        }
    }

    var autopostBinding: Binding<Bool> {
        Binding {
            setOptions.isInFlight ? tempAutopost : feed!.autopost
        } set: { newValue in
            tempAutopost = newValue
            setOptions.commit(id: feed!.id, autopost: newValue)
        }
    }
}

private let previewQuery = graphql("""
query FeedInfoSectionPreviewQuery {
    feed1: feed(id: "1") {
        ...FeedInfoSection_feed
    }
    feed2: feed(id: "2") {
        ...FeedInfoSection_feed
    }
}
""")

struct FeedInfoSection_Previews: PreviewProvider {
    static let op = FeedInfoSectionPreviewQuery()

    static var previews: some View {
        QueryPreview(op) { data in
            Group {
                NavigationView {
                    List {
                        FeedInfoSection(feed: data.feed1!.asFragment())
                    }
                    .listStyle(InsetGroupedListStyle())
                }
                NavigationView {
                    List {
                        FeedInfoSection(feed: data.feed2!.asFragment())
                    }
                    .listStyle(InsetGroupedListStyle())
                }
            }
        }
        .previewPayload(op, resource: "FeedInfoSectionPreview")
    }
}
