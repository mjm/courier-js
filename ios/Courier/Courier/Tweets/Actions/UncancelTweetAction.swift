//
//  UncancelTweetAction.swift
//  Courier
//
//  Created by Matt Moriarity on 11/12/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Apollo
import Combinable
import Events
import Foundation
import UserActions

struct UncancelTweetAction: ReactiveUserAction {
    let tweet: AllTweetsFields

    var undoActionName: String? { nil }
    var displayName: String? { NSLocalizedString("Send to Drafts", comment: "") }

    var canPerform: Bool {
        tweet.status == .canceled
    }

    func publisher(context: UserActions.Context<Self>) -> AnyPublisher<(), Error> {
        Event.current[.tweetId] = tweet.id

        let input = UncancelTweetInput(id: tweet.id)
        return context.apolloClient
            .publisher(mutation: UncancelTweetMutation(input: input))
            .map { _ in () }
            .eraseToAnyPublisher()
    }
}

extension AllTweetsFields {
    var uncancelAction: UncancelTweetAction { .init(tweet: self) }
}
