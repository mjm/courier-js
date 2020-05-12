import SwiftUI
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
    @SwiftUI.Environment(\.relayEnvironment) var environment: Relay.Environment?

    @State private var selectedTag = 0
    @State private var isSettingsPresented = false

    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                Picker(selection: $selectedTag, label: EmptyView()) {
                    Text("Upcoming").tag(0)
                    Text("Past").tag(1)
                }
                    .pickerStyle(SegmentedPickerStyle())
                    .padding()

                Divider()

                RelayQuery(
                    op: TweetsScreenQuery(),
                    variables: .init(filter: selectedTag == 0 ? .upcoming : .past),
                    fetchPolicy: .storeAndNetwork,
                    loadingContent: LoadingView(text: "Loading tweets…"),
                    errorContent: ErrorView.init,
                    dataContent: { data in
                        Group {
                            if data?.viewer == nil {
                                Spacer()
                            } else {
                                TweetsList(tweets: data!.viewer!)
                            }
                        }
                    }
                ).frame(maxHeight: .infinity)
            }
                .navigationBarTitle("Tweets", displayMode: .inline)
                .navigationBarItems(leading: Button(
                    action: { self.isSettingsPresented = true },
                    label: { Image(systemName: "gear") }))
                .sheet(isPresented: $isSettingsPresented) {
                    SettingsScreen(isPresented: self.$isSettingsPresented)
                        .environment(\.relayEnvironment, self.environment)
                }
        }
    }
}

struct TweetsScreen_Previews: PreviewProvider {
    static var previews: some View {
        TweetsScreen()
    }
}
