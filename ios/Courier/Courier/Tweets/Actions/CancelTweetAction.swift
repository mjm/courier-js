//
//  CancelTweetAction.swift
//  Courier
//
//  Created by Matt Moriarity on 11/11/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Apollo
import Combinable
import Events
import Foundation
import UserActions

struct CancelTweetAction: MutationUserAction {
    let tweet: AllTweetsFields

    var undoActionName: String? { nil }
    var displayName: String? { NSLocalizedString("Don't Post", comment: "") }

    var canPerform: Bool {
        tweet.status == .draft
    }

    func mutation(context: UserActions.Context<CancelTweetAction>) -> CancelTweetMutation {
        Event.current[.tweetId] = tweet.id

        let input = CancelTweetInput(id: tweet.id)
        return CancelTweetMutation(input: input)
    }
}

extension AllTweetsFields {
    var cancelAction: CancelTweetAction { .init(tweet: self) }
}
