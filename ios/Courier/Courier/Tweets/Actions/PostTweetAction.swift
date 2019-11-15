//
//  PostTweetAction.swift
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

struct PostTweetAction: ReactiveUserAction {
    let tweet: AllTweetsFields

    var undoActionName: String? { nil }
    var displayName: String? { NSLocalizedString("Post to Twitter", comment: "") }

    var canPerform: Bool {
        tweet.status == .draft
    }

    func publisher(context: UserActions.Context<PostTweetAction>) -> AnyPublisher<(), Error> {
        Event.current[.tweetId] = tweet.id

        let input = PostTweetInput(id: tweet.id, body: tweet.body, mediaUrLs: tweet.mediaUrLs)
        return context.apolloClient
            .publisher(mutation: PostTweetMutation(input: input))
            .map { _ in }
            .eraseToAnyPublisher()
    }
}

extension AllTweetsFields {
    var postAction: PostTweetAction { .init(tweet: self) }
}
