//
//  TweetCellViewModel.swift
//  Courier
//
//  Created by Matt Moriarity on 11/11/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Combinable
import Foundation
import UserActions

final class TweetCellViewModel {
    @Published var tweet: AllTweetsFields
    let actionRunner: UserActions.Runner

    init(tweet: AllTweetsFields, actionRunner: UserActions.Runner) {
        self.tweet = tweet
        self.actionRunner = actionRunner
    }

    var body: AnyPublisher<String, Never> {
        $tweet.map(\.body).removeDuplicates().eraseToAnyPublisher()
    }

    var status: AnyPublisher<TweetStatus, Never> {
        $tweet.map(\.status).removeDuplicates().eraseToAnyPublisher()
    }

    private let dateFormatter = ISO8601DateFormatter()

    var postedAt: AnyPublisher<Date?, Never> {
        $tweet.map(\.postedAt).removeDuplicates().map { [dateFormatter] dateString in
            dateString.flatMap { dateFormatter.date(from: $0) }
        }.eraseToAnyPublisher()
    }

    var cancelAction: BoundUserAction<Void> {
        tweet.cancelAction.bind(to: actionRunner, options: .destructive)
    }
}

extension TweetCellViewModel: Hashable {
    static func == (lhs: TweetCellViewModel, rhs: TweetCellViewModel) -> Bool {
        lhs.tweet.id == rhs.tweet.id
    }

    func hash(into hasher: inout Hasher) {
        hasher.combine(tweet.id)
    }
}
