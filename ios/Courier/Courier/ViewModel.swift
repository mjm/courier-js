//
//  ViewModel.swift
//  Courier
//
//  Created by Matt Moriarity on 11/11/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Apollo
import Combinable
import PushNotifications
import UserActions

class ViewModel {
    let apolloClient: ApolloClient
    let actionRunner: UserActions.Runner

    var cancellables = Set<AnyCancellable>()

    init(client: ApolloClient = .main) {
        self.apolloClient = client
        self.actionRunner = UserActions.Runner()
        actionRunner.delegate = self
    }

    var presenter: UserActionPresenter? {
        get { actionRunner.presenter }
        set { actionRunner.presenter = newValue }
    }
}

extension ViewModel: UserActionRunnerDelegate {
    func actionRunner<A>(_ runner: UserActions.Runner, willPerformAction action: A, context: UserActions.Context<A>) where A : UserAction {
        context.apolloClient = apolloClient
    }

    func actionRunner<A>(_ runner: UserActions.Runner, didCompleteAction action: A, context: UserActions.Context<A>) where A : UserAction {
        // nothing
    }
}

private let apolloClientKey = UserActions.ContextKey<ApolloClient>()

extension UserActions.Context {
    var apolloClient: ApolloClient {
        get { self[apolloClientKey]! }
        set { self[apolloClientKey] = newValue }
    }
}
