//
//  SaveTweetAction.swift
//  Courier
//
//  Created by Matt Moriarity on 11/14/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Apollo
import Combinable
import Events
import Foundation
import UserActions

struct SaveTweetAction: ReactiveUserAction {
    let tweet: AllTweetsFields

    var undoActionName: String? { nil }
    var displayName: String? { NSLocalizedString("Save Draft", comment: "") }
    var shortDisplayName: String? { NSLocalizedString("Save", comment: "") }

    var canPerform: Bool {
        tweet.status == .draft
    }

    func publisher(context: UserActions.Context<SaveTweetAction>) -> AnyPublisher<(), Error> {
        Event.current[.tweetId] = tweet.id

        let input = EditTweetInput(id: tweet.id, body: tweet.body, mediaUrLs: tweet.mediaUrLs)
        return context.apolloClient
            .publisher(mutation: EditTweetMutation(input: input))
            .map { _ in }
            .eraseToAnyPublisher()
    }
}

extension AllTweetsFields {
    var saveAction: SaveTweetAction { .init(tweet: self) }
}
