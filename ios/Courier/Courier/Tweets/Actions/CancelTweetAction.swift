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

struct CancelTweetAction: ReactiveUserAction {
    let tweetId: GraphQLID

    var undoActionName: String? { nil }
    var displayName: String? { NSLocalizedString("Don't Post", comment: "") }

    func publisher(context: UserActions.Context<Self>) -> AnyPublisher<(), Error> {
        Event.current[.tweetId] = tweetId

        let input = CancelTweetInput(id: tweetId)
        return context.apolloClient
            .publisher(mutation: CancelTweetMutation(input: input))
            .map { _ in () }
            .eraseToAnyPublisher()
    }
}

extension AllTweetsFields {
    var cancelAction: CancelTweetAction { .init(tweetId: id) }
}
