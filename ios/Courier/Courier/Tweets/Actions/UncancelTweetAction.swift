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

struct UncancelTweetAction: MutationUserAction {
    let tweet: AllTweetsFields

    var undoActionName: String? { nil }
    var displayName: String? { NSLocalizedString("Send to Drafts", comment: "") }

    var canPerform: Bool {
        tweet.status == .canceled
    }

    func mutation(context: UserActions.Context<Self>) -> UncancelTweetMutation {
        Event.current[.tweetId] = tweet.id

        let input = UncancelTweetInput(id: tweet.id)
        return UncancelTweetMutation(input: input)
    }

    func transform(context: UserActions.Context<UncancelTweetAction>, data: UncancelTweetMutation.Data) {
        context.apolloClient.store.moveTweet(id: data.uncancelTweet.tweet.id, from: \.past, to: \.upcoming)
    }
}

extension AllTweetsFields {
    var uncancelAction: UncancelTweetAction { .init(tweet: self) }
}
