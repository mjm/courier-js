//
//  TweetBodyCellViewModel.swift
//  Courier
//
//  Created by Matt Moriarity on 11/13/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Combinable
import UIKit

final class TweetBodyCellViewModel: TweetViewModel {
    @Published var tweet: AllTweetsFields?
    @Published var body: String?

    var cancellables = Set<AnyCancellable>()

    init() {
        $tweet.removeDuplicates { $0?.id == $1?.id }
            .map { $0?.body }
            .assign(to: \.body, on: self, weak: true)
            .store(in: &cancellables)
    }

    var isEditable: AnyPublisher<Bool, Never> {
        $tweet.map { $0?.status == .draft }.eraseToAnyPublisher()
    }
}

extension TweetBodyCellViewModel: Hashable {
    static func == (lhs: TweetBodyCellViewModel, rhs: TweetBodyCellViewModel) -> Bool {
        ObjectIdentifier(lhs) == ObjectIdentifier(rhs)
    }

    func hash(into hasher: inout Hasher) {
        hasher.combine(ObjectIdentifier(self))
    }
}
