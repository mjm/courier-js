import SwiftUI

struct ContentView: View {
    var body: some View {
        WithCurrentEndpoint {
            CurrentUser {
                EnvironmentProvider {
                    TweetsScreen()
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
