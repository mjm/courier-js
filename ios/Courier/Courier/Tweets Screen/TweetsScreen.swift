import SwiftUI
import struct SwiftUI.Environment
import Relay
import RelaySwiftUI

private let query = graphql("""
query TweetsScreenQuery($filter: TweetFilter!) {
  viewer {
    ...TweetsList_tweets @arguments(filter: $filter)
  }
}
""")

struct TweetsScreen: View {
    @Query(TweetsScreenQuery.self, fetchPolicy: .storeAndNetwork) var tweets

    private var filterBinding: Binding<TweetFilter> {
        Binding(get: { self.$tweets.filter }, set: { self.$tweets.filter = $0 })
    }

    @RelayEnvironment var environment: Relay.Environment
    @Environment(\.endpoint) var endpoint
    @Environment(\.authActions) var authActions
    @State private var isSettingsPresented = false

    init() {
        $tweets = .init(filter: .upcoming)
    }

    var body: some View {
        VStack(spacing: 0) {
            Picker(selection: filterBinding, label: EmptyView()) {
                Text("Upcoming").tag(TweetFilter.upcoming)
                Text("Past").tag(TweetFilter.past)
            }
                .pickerStyle(SegmentedPickerStyle())
                .padding()

            Divider()

            tweetsList
        }
            .navigationBarTitle("Tweets", displayMode: .inline)
            .navigationBarItems(leading: Button(
                action: { self.isSettingsPresented = true },
                label: { Image(systemName: "person.crop.circle") }
            ).padding(8))
            .sheet(isPresented: $isSettingsPresented) {
                SettingsScreen(isPresented: self.$isSettingsPresented)
                    .relayEnvironment(self.environment)
                    .environment(\.endpoint, self.endpoint)
                    .environment(\.authActions, self.authActions)
            }
    }

    var tweetsList: some View {
        Group {
            if tweets.isLoading {
                LoadingView(text: "Loading tweets…")
            } else if tweets.error != nil {
                ErrorView(error: tweets.error!)
            } else if tweets.data?.viewer == nil {
                Spacer()
            } else {
                TweetsList(tweets: tweets.data!.viewer!, filter: $tweets.filter)
            }
        }.frame(maxHeight: .infinity)
    }
}
