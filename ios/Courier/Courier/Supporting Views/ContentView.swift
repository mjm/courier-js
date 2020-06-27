import SwiftUI

struct ContentView: View {
    var body: some View {
        CurrentUser {
            EnvironmentProvider {
                NavigationView {
                    TweetsScreen()
                    Text("Choose a tweet to look at")
                }
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
