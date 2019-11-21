//
//  SettingsViewModel.swift
//  Courier
//
//  Created by Matt Moriarity on 11/20/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Apollo
import Combinable
import UIKit

final class SettingsViewModel: ViewModel {
    enum Section {
        case account
    }

    enum Item: Hashable {
        case environment(EnvironmentCellViewModel)
    }

    typealias Snapshot = NSDiffableDataSourceSnapshot<Section, Item>

    var accountItems: [Item]!

    override init(client: ApolloClient = .main) {
        super.init(client: client)

        accountItems = [
            .environment(EnvironmentCellViewModel())
        ]
    }

    var snapshot: AnyPublisher<Snapshot, Never> {
        var snapshot = Snapshot()

        snapshot.appendSections([.account])
        snapshot.appendItems(accountItems, toSection: .account)

        return Just(snapshot).eraseToAnyPublisher()
    }
}
