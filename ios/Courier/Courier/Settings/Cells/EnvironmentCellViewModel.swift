//
//  EnvironmentCellViewModel.swift
//  Courier
//
//  Created by Matt Moriarity on 11/20/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Combinable

final class EnvironmentCellViewModel {
    @UserDefault(\.environment)
    var value: String

    func toggle() {
        self.value = value == "production" ? "staging" : "production"
    }
}

extension EnvironmentCellViewModel: Hashable {
    static func == (lhs: EnvironmentCellViewModel, rhs: EnvironmentCellViewModel) -> Bool {
        ObjectIdentifier(lhs) == ObjectIdentifier(rhs)
    }

    func hash(into hasher: inout Hasher) {
        hasher.combine(ObjectIdentifier(self))
    }
}
