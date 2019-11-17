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
import UserActions

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    var notificationsEvent = EventBuilder()

    let actionRunner = UserActions.Runner()

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

        actionRunner.presenter = self
        actionRunner.delegate = self

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

        actionRunner.perform(RegisterDeviceAction(token: deviceToken))
    }

    func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        notificationsEvent.stopTimer(.registerTime)
        notificationsEvent.error = error
        notificationsEvent.send("registered for remote notifications")
    }

}

extension AppDelegate: UserActionRunnerDelegate {
    func actionRunner<A>(_ runner: UserActions.Runner, willPerformAction action: A, context: UserActions.Context<A>) where A : UserAction {
        context.apolloClient = .main
    }

    func actionRunner<A>(_ runner: UserActions.Runner, didCompleteAction action: A, context: UserActions.Context<A>) where A : UserAction {
        // do nothing
    }
}

extension AppDelegate: UserActionPresenter {
    var rootViewController: UIViewController? {
        UIApplication.shared.windows.first { $0.isKeyWindow }?.rootViewController
    }

    func present(_ viewControllerToPresent: UIViewController, animated flag: Bool, completion: (() -> Void)?) {
        rootViewController?.present(viewControllerToPresent, animated: flag, completion: completion)
    }

    func dismiss(animated flag: Bool, completion: (() -> Void)?) {
        rootViewController?.dismiss(animated: flag, completion: completion)
    }
}
