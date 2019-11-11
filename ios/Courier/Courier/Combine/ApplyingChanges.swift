//
//  ApplyingDifferences.swift
//  Courier
//
//  Created by Matt Moriarity on 11/11/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Combinable

extension Publisher {
    func applyingChanges<Other: Publisher, C: BidirectionalCollection>(
        from other: Other,
        keyPath: ReferenceWritableKeyPath<Output.Element, C.Element>,
        creator: @escaping (C.Element) -> Output.Element
    ) -> AnyPublisher<Output, Failure>
    where Output: RangeReplaceableCollection,
        Output.Index == Int,
        Other.Output == C,
        Other.Failure == Failure,
        C.Element: Identifiable
    {
        combineLatest(other) { outers, inners in
            let diff = inners.difference(from: outers.map { $0[keyPath: keyPath] }) { $0.id == $1.id }

            var newOuters = outers

            for change in diff {
                switch change {
                case .remove(let index, _, _):
                    newOuters.remove(at: index)
                case .insert(let index, let inner, _):
                    newOuters.insert(creator(inner), at: index)
                }
            }

            // update existing objects
            for (outer, inner) in Swift.zip(newOuters, inners) {
                outer[keyPath: keyPath] = inner
            }

            return newOuters
        }.eraseToAnyPublisher()
    }
}
