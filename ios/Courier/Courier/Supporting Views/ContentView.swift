import SwiftUI

struct ContentView: View {
    var body: some View {
        WithCurrentEndpoint {
            CurrentUser {
                EnvironmentProvider {
                    NavigationView {
                        TweetsScreen()
                        Text("Choose a tweet to look at")
                    }
                }
            }
        }.accentColor(.purple)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
