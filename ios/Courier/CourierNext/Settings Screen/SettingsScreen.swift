import SwiftUI
import RelaySwiftUI

private let query = graphql("""
query SettingsScreenQuery {
  viewer {
    ...UserProfileSection_user
  }
}
""")

struct SettingsScreen: View {
    @Binding var isPresented: Bool

    var body: some View {
        NavigationView {
            RelayQuery(
                op: SettingsScreenQuery(),
                variables: .init(),
                fetchPolicy: .storeAndNetwork,
                loadingContent: LoadingView(text: "Loading profile…"),
                errorContent: ErrorView.init
            ) { data in
                Group {
                    if data?.viewer == nil {
                        Spacer()
                    } else {
                        List {
                            UserProfileSection(user: data!.viewer!)
                        }
                            .listStyle(GroupedListStyle())
                    }
                }
            }
                .navigationBarTitle("Settings")
                .navigationBarItems(trailing: Button("Close") { self.isPresented = false })
        }
    }
}
