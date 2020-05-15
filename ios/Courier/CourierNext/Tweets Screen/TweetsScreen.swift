import SwiftUI
import RelaySwiftUI

private let query = graphql("""
query TweetsScreenQuery($filter: TweetFilter!) {
  viewer {
    ...TweetsList_tweets @arguments(filter: $filter)
  }
}
""")

struct TweetsScreen: View {
    @Environment(\.endpoint) var endpoint
    @Environment(\.relayEnvironment) var environment
    @Environment(\.authActions) var authActions

    @State private var selectedTag = 0
    @State private var isSettingsPresented = false

    init() {
        print("creating new tweets screen")
    }

    var body: some View {
        VStack {
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
                        errorContent: { ErrorView(error: $0) },
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

            }
            Text("").hidden().sheet(isPresented: $isSettingsPresented) {
                SettingsScreen(isPresented: self.$isSettingsPresented)
                    .environment(\.endpoint, self.endpoint)
                    .environment(\.relayEnvironment, self.environment)
                    .environment(\.authActions, self.authActions)
            }
        }
    }
}

struct TweetsScreen_Previews: PreviewProvider {
    static var previews: some View {
        TweetsScreen()
    }
}
