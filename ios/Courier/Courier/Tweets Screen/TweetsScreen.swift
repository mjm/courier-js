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
    @State private var filter: TweetFilter = .upcoming
    @Query<TweetsScreenQuery>(fetchPolicy: .storeAndNetwork) var tweets
    @RelayEnvironment var environment: Relay.Environment
    @EnvironmentObject var authContext: AuthContext
    @State private var isSettingsPresented = false
    @State private var isInspectorPresented = false

    @ViewBuilder var body: some View {
        VStack(spacing: 0) {
            Picker(selection: $filter, label: EmptyView()) {
                Text("Upcoming").tag(TweetFilter.upcoming)
                Text("Past").tag(TweetFilter.past)
            }
            .pickerStyle(SegmentedPickerStyle())
            .padding()

            Divider()

            tweetsList
        }
        .navigationBarTitle("Tweets", displayMode: .inline)
        .navigationBarItems(
            leading: Button {
                isSettingsPresented = true
            } label: {
                Image(systemName: "person.crop.circle")
            }.padding(8),
            trailing: Group {
                #if DEBUG
                Button {
                    self.isInspectorPresented = true
                } label: {
                    Image(systemName: "briefcase")
                }
                .sheet(isPresented: $isInspectorPresented) {
                    NavigationView { RelaySwiftUI.Inspector() }
                        .relayEnvironment(self.environment)
                }
                #endif
            }
        )
        .sheet(isPresented: $isSettingsPresented) {
            SettingsScreen(isPresented: self.$isSettingsPresented)
                .relayEnvironment(self.environment)
                .environmentObject(self.authContext)
        }
    }

    var tweetsList: some View {
        Group {
            switch tweets.get(filter: filter) {
            case .loading:
                LoadingView(text: "Loading tweets…")
            case .failure(let error):
                ErrorView(error: error)
            case .success(let data):
                if let viewer = data?.viewer {
                    TweetsList(tweets: viewer.asFragment(), filter: filter)
                } else {
                    Spacer()
                }
            }
        }
        .frame(maxHeight: .infinity)
    }
}
