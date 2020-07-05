import SwiftUI

struct Sidebar: View {
    @EnvironmentObject var screenCoordinator: ScreenCoordinator
    
    var body: some View {
        List(selection: $screenCoordinator.filter) {
            Section(header: Text("Tweets")) {
                NavigationLink(
                    destination: TweetsScreen(filter: .upcoming),
                    tag: TweetFilter.upcoming,
                    selection: $screenCoordinator.filter
                ) {
                    Label("Inbox", systemImage: "tray.fill")
                }
                .tag(TweetFilter.upcoming)
                
                NavigationLink(
                    destination: TweetsScreen(filter: .past),
                    tag: TweetFilter.past,
                    selection: $screenCoordinator.filter
                ) {
                    Label("Reviewed", systemImage: "checkmark.rectangle")
                }
                .tag(TweetFilter.past)
            }
        }
        .listStyle(SidebarListStyle())
    }
}

struct Sidebar_Previews: PreviewProvider {
    static var previews: some View {
        Sidebar()
            .frame(width: 250.0)
    }
}
