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
        case logout
        case login
    }

    typealias Snapshot = NSDiffableDataSourceSnapshot<Section, Item>

    @Published private(set) var userState: QueryState<UserInfo?> = .loading

    var userViewModel = UserCellViewModel()
    var environmentViewModel = EnvironmentCellViewModel()

    override init(client: ApolloClient = .main) {
        super.init(client: client)

        userInfo.assign(to: \.userState, on: self, weak: true).store(in: &cancellables)
        $userState.ignoreLoading().assign(to: \.user, on: userViewModel).store(in: &cancellables)
    }

    var snapshot: AnyPublisher<Snapshot, Never> {
        $userState.map { [weak self] userState in
            var snapshot = Snapshot()
            guard let self = self else { return snapshot }

            snapshot.appendSections([.account])
            var accountItems: [Item] = [.environment(self.environmentViewModel)]
            switch userState {
            case .loaded(nil):
                accountItems.append(.login)
            case .loaded:
                accountItems.insert(.user(self.userViewModel), at: 0)
                accountItems.append(.logout)
            default: break
            }
            snapshot.appendItems(accountItems, toSection: .account)

            return snapshot
        }.eraseToAnyPublisher()
    }

    private var userInfo: AnyPublisher<QueryState<UserInfo?>, Never> {
        apolloClient.publisher(query: CurrentUserQuery())
            .queryMap { $0.currentUser?.fragments.userInfo }
            .ignoreError()
            .eraseToAnyPublisher()
    }

    func logout() {
        actionRunner.perform(LogoutAction())
    }

    func login() {
        actionRunner.perform(LoginAction())
    }
}
