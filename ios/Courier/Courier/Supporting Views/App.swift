import SwiftUI

@main
struct CourierApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate

    @StateObject private var screenCoordinator = ScreenCoordinator()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(screenCoordinator)
        }
    }
}
