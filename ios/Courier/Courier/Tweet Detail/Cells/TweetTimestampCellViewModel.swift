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

private let dateFormatter: ISO8601DateFormatter = {
    let formatter = ISO8601DateFormatter()
    formatter.formatOptions.insert(.withFractionalSeconds)
    return formatter
}()

final class TweetTimestampCellViewModel {
    @Published var tweet: AllTweetsFields?
    @Published private(set) var action: BoundUserAction<Void>?

    let keyPath: KeyPath<AllTweetsFields, String?>
    let hasAction: Bool

    private var cancellables = Set<AnyCancellable>()

    init(
        keyPath: KeyPath<AllTweetsFields, String?>,
        actionCreator: ((AllTweetsFields) -> BoundUserAction<Void>?)?
    ) {
        self.keyPath = keyPath
        self.hasAction = actionCreator != nil

        if let actionCreator = actionCreator {
            $tweet.map { $0.flatMap(actionCreator) }.assign(to: \.action, on: self, weak: true).store(in: &cancellables)
        }
    }

    var date: AnyPublisher<Date?, Never> {
        $tweet.map { [keyPath] tweet in
            tweet?[keyPath: keyPath].flatMap { dateFormatter.date(from: $0) }
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
