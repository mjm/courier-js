//
//  TweetActionCellViewModel.swift
//  Courier
//
//  Created by Matt Moriarity on 11/19/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Combinable
import UIKit
import UserActions

final class TweetActionCellViewModel: TweetViewModel {
    @Published var tweet: AllTweetsFields?
    @Published var action: BoundUserAction<Void>?

    private var cancellables = Set<AnyCancellable>()

    init(actionCreator: @escaping (AllTweetsFields) -> BoundUserAction<Void>?) {
        $tweet.map { $0.flatMap(actionCreator) }.assign(to: \.action, on: self, weak: true).store(in: &cancellables)
    }
}

extension TweetActionCellViewModel: Hashable {
    static func == (lhs: TweetActionCellViewModel, rhs: TweetActionCellViewModel) -> Bool {
        ObjectIdentifier(lhs) == ObjectIdentifier(rhs)
    }

    func hash(into hasher: inout Hasher) {
        hasher.combine(ObjectIdentifier(self))
    }
}
