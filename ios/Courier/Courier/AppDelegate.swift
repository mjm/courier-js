import UIKit
import UserNotifications
import os

private let logger = Logger(subsystem: "blog.courier.Courier", category: "notifications")

class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        UserDefaults.standard.register(defaults: ["siteEnvironment": "production"])

        Endpoint.current.pushNotifications.start()
        try? Endpoint.current.pushNotifications.addDeviceInterest(interest: "debug-test")

        let userNotifications = UNUserNotificationCenter.current()
        userNotifications.delegate = NotificationHandler.shared
        userNotifications.setNotificationCategories(NotificationCategory.all)
        userNotifications.requestAuthorization(options: [.alert, .badge, .sound]) { authorized, error in
            if let error = error {
                logger.error("Permission request failure:  \(error as NSError)")
            } else if authorized {
                logger.info("Permissions granted")
            } else {
                logger.notice("Permissions denied")
            }
            Endpoint.current.pushNotifications.registerForRemoteNotifications()
        }

        return true
    }

    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        Endpoint.current.pushNotifications.registerDeviceToken(deviceToken)
        logger.info("Device registration success")
    }

    func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        logger.error("Device registration failure:  \(error as NSError)")
    }

    func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
        Endpoint.current.pushNotifications.handleNotification(userInfo: userInfo)
        completionHandler(.noData)
    }
}
