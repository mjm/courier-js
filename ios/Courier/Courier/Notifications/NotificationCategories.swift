//
//  NotificationCategories.swift
//  Courier
//
//  Created by Matt Moriarity on 11/18/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import UserNotifications

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
