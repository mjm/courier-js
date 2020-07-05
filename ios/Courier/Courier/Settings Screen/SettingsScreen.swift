import SwiftUI
import RelaySwiftUI

private let query = graphql("""
query SettingsScreenQuery {
  viewer {
    ...UserProfileSection_user
    ...SubscriptionSection_user
  }
}
""")

struct SettingsScreen: View {
    @Query(SettingsScreenQuery.self, fetchPolicy: .storeAndNetwork) var query

    @EnvironmentObject var authContext: AuthContext
    @Binding var isPresented: Bool

    var body: some View {
        NavigationView {
            #if os(iOS)
            Group {
                switch query.get() {
                case .loading:
                    LoadingView(text: "Loading profile…")
                case .failure(let error):
                    ErrorView(error: error)
                case .success(let data):
                    if let viewer = data?.viewer {
                        Form {
                            UserProfileSection(user: viewer.asFragment(), onLogout: {
                                isPresented = false
                                authContext.logout()
                            })
                            SubscriptionSection(user: viewer.asFragment())
                            #if DEBUG
                            EnvironmentSection(isPresented: $isPresented)
                            #endif
                        }
                    } else {
                        Spacer()
                    }
                }
            }
            .navigationBarItems(trailing: Button("Close") { isPresented = false })
            .navigationBarTitle(Text("Settings"), displayMode: .inline)
            #else
            EmptyView()
            #endif
        }
    }
}
