import SwiftUI
import RelaySwiftUI
import CourierGenerated

private let feedFragment = graphql("""
fragment FeedInfoSection_feed on Feed {
    id
    refreshedAt
    refreshing
    autopost
}
""")

struct FeedInfoSection: View {
    @Fragment<FeedInfoSection_feed> var feed
    @Mutation<RefreshFeedMutation> var refreshFeed
    @Mutation<SetFeedOptionsMutation> var setOptions

    // It's important that the toggle binding's state updates in the same
    // run of the event loop, otherwise the UI stutters. An optimistic
    // response doesn't do this, so we use this state for the value to show
    // while the request is in-flight.
    @State private var tempAutopost = false

    var body: some View {
        if let feed = feed {
            Section {
                if feed.refreshing {
                    Label {
                        Text("Checking now…")
                    } icon: {
                        Image(systemName: "arrow.triangle.2.circlepath.circle.fill")
                            .spinning()
                            .foregroundColor(.accentColor)
                    }
                } else if let refreshedAt = feed.refreshedAt?.asDate {
                    Button {
                        refreshFeed.commit(id: feed.id)
                    } label: {
                        Label {
                            (Text("Last checked ") + Text(refreshedAt, style: .relative) + Text(" ago"))
                                .foregroundColor(.primary)
                        } icon: {
                            Image(systemName: "arrow.triangle.2.circlepath.circle.fill")
                                .foregroundColor(.accentColor)
                        }
                    }
                    .disabled(refreshFeed.isInFlight)
                }

                Toggle("Post automatically", isOn: autopostBinding)
                    .disabled(setOptions.isInFlight)
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
