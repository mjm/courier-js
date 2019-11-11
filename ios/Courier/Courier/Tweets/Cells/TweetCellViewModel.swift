//
//  TweetCellViewModel.swift
//  Courier
//
//  Created by Matt Moriarity on 11/11/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Combinable
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
}

extension TweetCellViewModel: Hashable {
    static func == (lhs: TweetCellViewModel, rhs: TweetCellViewModel) -> Bool {
        lhs.tweet.id == rhs.tweet.id
    }

    func hash(into hasher: inout Hasher) {
        hasher.combine(tweet.id)
    }
}
