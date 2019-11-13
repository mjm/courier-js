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

    private let dateFormatter: ISO8601DateFormatter = {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions.insert(.withFractionalSeconds)
        return formatter
    }()

    var postedAt: AnyPublisher<Date?, Never> {
        $tweet.map(\.postedAt).removeDuplicates().map { [dateFormatter] dateString in
            dateString.flatMap { dateFormatter.date(from: $0) }
        }.eraseToAnyPublisher()
    }

    var cancelAction: BoundUserAction<Void>? {
        let action = tweet.cancelAction
        return action.canPerform ? action.bind(to: actionRunner, options: .destructive) : nil
    }

    var uncancelAction: BoundUserAction<Void>? {
        let action = tweet.uncancelAction
        return action.canPerform ? action.bind(to: actionRunner) : nil
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
