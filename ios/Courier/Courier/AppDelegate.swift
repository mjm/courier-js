//
//  AppDelegate.swift
//  Courier
//
//  Created by Matt Moriarity on 11/10/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Auth0
import Events
import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    var notificationsEvent = EventBuilder()

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

        notificationsEvent.startTimer(.registerTime)
        application.registerForRemoteNotifications()

        return true
    }

    // MARK: UISceneSession Lifecycle

    func application(_ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        return UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    }

    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        notificationsEvent.stopTimer(.registerTime)
        notificationsEvent[.tokenLength] = deviceToken.count
        notificationsEvent.send("registered for remote notifications")
    }

    func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        notificationsEvent.stopTimer(.registerTime)
        notificationsEvent.error = error
        notificationsEvent.send("registered for remote notifications")
    }

}

