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

    @Environment(\.authActions) var authActions
    @Binding var isPresented: Bool

    var body: some View {
        NavigationView {
            Group {
                if query.isLoading {
                    LoadingView(text: "Loading profile…")
                } else if query.error != nil {
                    ErrorView(error: query.error!)
                } else if query.data?.viewer == nil {
                    Spacer()
                } else {
                    Form {
                        UserProfileSection(user: query.data!.viewer!, onLogout: {
                            self.isPresented = false
                            self.authActions.logout()
                        })
                        SubscriptionSection(user: query.data!.viewer!)
                        #if DEBUG
                        EnvironmentSection(isPresented: self.$isPresented)
                        #endif
                    }
                }
            }
                .navigationBarItems(trailing: Button("Close") { self.isPresented = false })
                .navigationBarTitle(Text("Settings"), displayMode: .inline)
        }
    }
}
