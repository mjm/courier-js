//
//  AppDelegate.swift
//  Courier
//
//  Created by Matt Moriarity on 11/10/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Apollo
import Auth0
import Events
import UIKit
import UserActions
import UserNotifications

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    var notificationsEvent = EventBuilder()

    let actionRunner = UserActions.Runner()

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

        actionRunner.presenter = self
        actionRunner.delegate = self

        notificationsEvent.startTimer(.registerTime)
        application.registerForRemoteNotifications()

        let userNotifications = UNUserNotificationCenter.current()
        userNotifications.delegate = self
        userNotifications.setNotificationCategories(NotificationCategory.all)
        userNotifications.requestAuthorization(options: [.alert, .badge, .sound]) { authorized, error in
            var event = EventBuilder()
            event[.authorized] = authorized
            event.error = error
            event.send("requested notification permission")
        }

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

extension AppDelegate: UNUserNotificationCenterDelegate {
    func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
        let userInfo = response.notification.request.content.userInfo
        let tweetId = userInfo["tweetId"] as? String

        switch NotificationAction(rawValue: response.actionIdentifier) {
        case .postTweetNow:
            withTweet(id: tweetId) { tweet in
                self.actionRunner.perform(tweet.postAction).ignoreError().handle(receiveCompletion: { _ in
                    completionHandler()
                }, receiveValue: {})
            }
        case .editTweet:
            editTweet(id: tweetId)
            completionHandler()
        case .cancelTweet:
            withTweet(id: tweetId) { tweet in
                self.actionRunner.perform(tweet.cancelAction).ignoreError().handle(receiveCompletion: { _ in
                    completionHandler()
                }, receiveValue: {})
            }
        default:
            if response.actionIdentifier == UNNotificationDefaultActionIdentifier {
                editTweet(id: tweetId)
            }

            completionHandler()
            return
        }

    }

    private func editTweet(id: GraphQLID?) {
        guard let splitViewController = rootViewController as? SplitViewController else {
            NSLog("Couldn't get split view controller")
            return
        }

        splitViewController.viewModel.selection = id
        if splitViewController.detailNavController.parent != splitViewController.masterNavController {
            splitViewController.showDetailViewController(splitViewController.detailNavController, sender: self)
        }
    }

    private func withTweet(id: GraphQLID?, _ body: @escaping (AllTweetsFields) -> Void) {
        guard let id = id else { return }

        ApolloClient.main.fetch(query: GetTweetQuery(id: id), cachePolicy: .fetchIgnoringCacheData) { result in
            do {
                if let tweet = try result.get().data?.tweet?.fragments.allTweetsFields {
                    body(tweet)
                }
            } catch {}
        }
    }
}
