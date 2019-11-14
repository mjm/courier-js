//
//  TweetBodyCellViewModel.swift
//  Courier
//
//  Created by Matt Moriarity on 11/13/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Combinable
import UIKit

final class TweetBodyCellViewModel {
    @Published var body: String?
}

extension TweetBodyCellViewModel: Hashable {
    static func == (lhs: TweetBodyCellViewModel, rhs: TweetBodyCellViewModel) -> Bool {
        ObjectIdentifier(lhs) == ObjectIdentifier(rhs)
    }

    func hash(into hasher: inout Hasher) {
        hasher.combine(ObjectIdentifier(self))
    }
}
