import SwiftUI

struct ContentView: View {
    var body: some View {
        CurrentUser {
            EnvironmentProvider {
                NavigationView {
                    Sidebar()
                        .frame(minWidth: 150, idealWidth: 200, maxWidth: 300, maxHeight: .infinity)
                    Text("Content List")
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                    Text("Select a tweet")
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                }
            }
        }
        .frame(minWidth: 900, maxWidth: .infinity, minHeight: 500, maxHeight: .infinity)
    }
}
