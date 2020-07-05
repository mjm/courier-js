import SwiftUI

@main
struct CourierMacApp: App {
    @StateObject private var screenCoordinator = ScreenCoordinator()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(screenCoordinator)
        }
    }
}
