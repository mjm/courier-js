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
            Group {
                switch query.get() {
                case .loading:
                    LoadingView(text: "Loading profile…")
                case .failure(let error):
                    ErrorView(error: error)
                case .success(let data):
                    if let viewer = data?.viewer {
                        Form {
                            UserProfileSection(user: viewer, onLogout: {
                                isPresented = false
                                authContext.logout()
                            })
                            SubscriptionSection(user: viewer)
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
        }
    }
}
