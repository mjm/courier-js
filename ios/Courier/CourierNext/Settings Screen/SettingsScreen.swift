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
    @Environment(\.authActions) var authActions
    @Binding var isPresented: Bool

    var body: some View {
        NavigationView {
            RelayQuery(
                op: SettingsScreenQuery(),
                fetchPolicy: .storeAndNetwork,
                loadingContent: LoadingView(text: "Loading profile…"),
                errorContent: { ErrorView(error: $0) }
            ) { data in
                Group {
                    if data?.viewer == nil {
                        Spacer()
                    } else {
                        Form {
                            #if DEBUG
                            EnvironmentSection(isPresented: self.$isPresented)
                            #endif
                            UserProfileSection(user: data!.viewer!, onLogout: {
                                self.isPresented = false
                                self.authActions.logout()
                            })
                            SubscriptionSection(user: data!.viewer!)
                        }
                    }
                }
            }
                .navigationBarTitle("Settings")
                .navigationBarItems(trailing: Button("Close") { self.isPresented = false })
        }
    }
}
