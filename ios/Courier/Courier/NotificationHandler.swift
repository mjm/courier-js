import Combine
import os
import Relay
import UserNotifications
import CourierGenerated

private let logger = Logger(subsystem: "blog.courier.Courier", category: "notifications")

class NotificationHandler: NSObject, UNUserNotificationCenterDelegate {
    static let shared = NotificationHandler()

    var environment: Relay.Environment?
    var screenCoordinator: ScreenCoordinator?

    var cancellables = Set<AnyCancellable>()

    func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
        let userInfo = response.notification.request.content.userInfo
        let data = userInfo["data"] as? [String: Any]
        guard let tweetId = data?["tweetId"] as? String else {
            logger.error("No tweet ID present in notification, doing nothing")
            completionHandler()
            return
        }

        switch NotificationAction(rawValue: response.actionIdentifier) {
        case .postTweetNow:
            let input = PostTweetInput(id: tweetId)
            performMutation(PostTweetMutation(variables: .init(input: input)), completion: completionHandler)

        case .editTweet:
            editTweet(id: tweetId)
            completionHandler()

        case .cancelTweet:
            let input = CancelTweetInput(id: tweetId)
            performMutation(CancelTweetMutation(variables: .init(input: input)), completion: completionHandler)

        default:
            if response.actionIdentifier == UNNotificationDefaultActionIdentifier {
                editTweet(id: tweetId)
            }

            completionHandler()
            return
        }
    }

    private func performMutation<O: Relay.Operation>(_ mutation: O, completion: @escaping () -> Void) {
        guard let environment = environment else {
            logger.error("Relay environment is not set on NotificationHandler, cannot perform mutation")
            completion()
            return
        }

        environment.commitMutation(mutation).sink(receiveCompletion: { result in
            switch result {
            case .failure(let error):
                logger.error("Mutation failure:  \(type(of: mutation), privacy: .public)  \(error as NSError)")
            case .finished:
                logger.info("Mutation success:  \(type(of: mutation), privacy: .public)")
            }

            completion()
        }, receiveValue: { _ in }).store(in: &cancellables)
    }

    private func editTweet(id: String) {
        screenCoordinator?.selectedTweetID = id
    }
}

enum NotificationCategory: String, CaseIterable {
    case importedTweet = "IMPORTED_TWEET"
    case postedTweet = "POSTED_TWEET"

    var actions: [NotificationAction] {
        switch self {
        case .importedTweet:
            return [.postTweetNow, .editTweet, .cancelTweet]
        case .postedTweet:
            return []
        }
    }

    var category: UNNotificationCategory {
        UNNotificationCategory(
            identifier: rawValue,
            actions: actions.map { $0.action },
            intentIdentifiers: [],
            hiddenPreviewsBodyPlaceholder: nil,
            categorySummaryFormat: nil,
            options: [.hiddenPreviewsShowTitle]
        )
    }

    static var all: Set<UNNotificationCategory> {
        Set(allCases.map { $0.category })
    }
}

enum NotificationAction: String {
    case postTweetNow
    case editTweet
    case cancelTweet

    var title: String {
        switch self {
        case .postTweetNow:
            return NSLocalizedString("Post Now", comment: "")
        case .editTweet:
            return NSLocalizedString("Edit", comment: "")
        case .cancelTweet:
            return NSLocalizedString("Don't Post", comment: "")
        }
    }

    var options: UNNotificationActionOptions {
        switch self {
        case .postTweetNow:
            return []
        case .editTweet:
            return [.foreground]
        case .cancelTweet:
            return [.destructive]
        }
    }
}

extension NotificationAction {
    var action: UNNotificationAction {
        UNNotificationAction(identifier: rawValue, title: title, options: options)
    }
}
