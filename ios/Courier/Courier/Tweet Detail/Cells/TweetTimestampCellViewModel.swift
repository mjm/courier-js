//
//  TweetTimestampCellViewModel.swift
//  Courier
//
//  Created by Matt Moriarity on 11/21/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Combinable
import Foundation
import UserActions

final class TweetTimestampCellViewModel {
    @Published var tweet: AllTweetsFields?
    @Published private(set) var action: BoundUserAction<Void>?

    let keyPath: KeyPath<AllTweetsFields, Date?>
    let hasAction: Bool

    private var cancellables = Set<AnyCancellable>()

    init(
        keyPath: KeyPath<AllTweetsFields, Date?>,
        actionCreator: ((AllTweetsFields) -> BoundUserAction<Void>?)? = nil
    ) {
        self.keyPath = keyPath
        self.hasAction = actionCreator != nil

        if let actionCreator = actionCreator {
            $tweet.map { $0.flatMap(actionCreator) }.assign(to: \.action, on: self, weak: true).store(in: &cancellables)
        }
    }

    var date: AnyPublisher<Date?, Never> {
        $tweet.map { [keyPath] tweet in
            tweet?[keyPath: keyPath]
        }.eraseToAnyPublisher()
    }
}

extension TweetTimestampCellViewModel: Hashable {
    static func == (lhs: TweetTimestampCellViewModel, rhs: TweetTimestampCellViewModel) -> Bool {
        ObjectIdentifier(lhs) == ObjectIdentifier(rhs)
    }

    func hash(into hasher: inout Hasher) {
        hasher.combine(ObjectIdentifier(self))
    }
}
