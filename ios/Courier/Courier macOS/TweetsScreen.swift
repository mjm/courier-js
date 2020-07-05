import SwiftUI
import Relay
import RelaySwiftUI

struct TweetsScreen: View {
    let filter: TweetFilter
    @Query<TweetsScreenQuery>(fetchPolicy: .storeAndNetwork) var tweets
//    @RelayEnvironment var environment: Relay.Environment
//    @EnvironmentObject var authContext: AuthContext
//    @State private var isSettingsPresented = false
//    @State private var isInspectorPresented = false

    @ViewBuilder var body: some View {
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
        .navigationTitle(filter == .upcoming ? "Inbox" : "Reviewed Tweets")
        .frame(minWidth: 270, idealWidth: 300, maxWidth: 400, maxHeight: .infinity)
    }
}
