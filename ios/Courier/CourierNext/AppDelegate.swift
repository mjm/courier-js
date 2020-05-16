import UIKit
import UserNotifications

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        Endpoint.current.pushNotifications.start()
        try? Endpoint.current.pushNotifications.addDeviceInterest(interest: "debug-test")

        let userNotifications = UNUserNotificationCenter.current()
        userNotifications.delegate = NotificationHandler.shared
        userNotifications.setNotificationCategories(NotificationCategory.all)
        userNotifications.requestAuthorization(options: [.alert, .badge, .sound]) { authorized, error in
            NSLog("requested notification permission, authorized=\(authorized) error=\(String(describing: error))")
            Endpoint.current.pushNotifications.registerForRemoteNotifications()
        }

        return true
    }

    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        Endpoint.current.pushNotifications.registerDeviceToken(deviceToken)
        NSLog("registered for remote notifications")
    }

    func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        NSLog("failed to register for remote notifications: \(error)")
    }

    func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
        Endpoint.current.pushNotifications.handleNotification(userInfo: userInfo)
        completionHandler(.noData)
    }

    // MARK: UISceneSession Lifecycle

    func application(_ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        return UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    }

    func application(_ application: UIApplication, didDiscardSceneSessions sceneSessions: Set<UISceneSession>) {
    }
}
