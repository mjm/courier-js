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
        case user(UserCellViewModel)
        case environment(EnvironmentCellViewModel)
    }

    typealias Snapshot = NSDiffableDataSourceSnapshot<Section, Item>

    @Published private(set) var userState: QueryState<UserInfo?> = .loaded(nil)

    var userViewModel = UserCellViewModel()
    var environmentViewModel = EnvironmentCellViewModel()

    override init(client: ApolloClient = .main) {
        super.init(client: client)

        userInfo.assign(to: \.userState, on: self, weak: true).store(in: &cancellables)
        $userState.ignoreLoading().assign(to: \.user, on: userViewModel).store(in: &cancellables)
    }

    var snapshot: AnyPublisher<Snapshot, Never> {
        userInfo.map { [weak self] user in
            var snapshot = Snapshot()
            guard let self = self else { return snapshot }

            snapshot.appendSections([.account])
            snapshot.appendItems([
                .user(self.userViewModel),
                .environment(self.environmentViewModel),
            ], toSection: .account)

            return snapshot
        }.eraseToAnyPublisher()
    }

    private var userInfo: AnyPublisher<QueryState<UserInfo?>, Never> {
        apolloClient.publisher(query: CurrentUserQuery())
            .queryMap { $0.currentUser?.fragments.userInfo }
            .ignoreError()
            .eraseToAnyPublisher()
    }
}
