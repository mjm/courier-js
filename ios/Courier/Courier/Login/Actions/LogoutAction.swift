//
//  LogoutAction.swift
//  Courier
//
//  Created by Matt Moriarity on 11/10/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Auth0
import Combinable
import UserActions

struct LogoutAction: ReactiveUserAction {
    var undoActionName: String? { nil }

    func publisher(context: UserActions.Context<LogoutAction>) -> AnyPublisher<(), Error> {
        Future<(), Error> { promise in
            Endpoint.current.webAuth
                .clearSession(federated: false) { result in
                    _ = CredentialsManager.shared.clear()
                    promise(.success(()))
                }
        }.eraseToAnyPublisher()
    }
}
