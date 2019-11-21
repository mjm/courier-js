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

struct SaveTweetAction: MutationUserAction {
    let tweet: AllTweetsFields

    var undoActionName: String? { nil }
    var displayName: String? { NSLocalizedString("Save Draft", comment: "") }
    var shortDisplayName: String? { NSLocalizedString("Save", comment: "") }

    var canPerform: Bool {
        tweet.status == .draft
    }

    func mutation(context: UserActions.Context<SaveTweetAction>) -> EditTweetMutation {
        Event.current[.tweetId] = tweet.id

        let input = EditTweetInput(id: tweet.id, body: tweet.body, mediaUrLs: tweet.mediaUrLs)
        return EditTweetMutation(input: input)
    }
}

extension AllTweetsFields {
    var saveAction: SaveTweetAction { .init(tweet: self) }
}
