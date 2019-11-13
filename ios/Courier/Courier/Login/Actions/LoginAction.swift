//
//  LoginAction.swift
//  Courier
//
//  Created by Matt Moriarity on 11/10/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Auth0
import Combinable
import UserActions

struct LoginAction: ReactiveUserAction {
    typealias ResultType = Credentials

    var undoActionName: String? { nil }

    var canPerform: Bool {
        !CredentialsManager.shared.hasValid()
    }

    func publisher(context: UserActions.Context<LoginAction>) -> AnyPublisher<Credentials, Swift.Error> {
        Future<Credentials, Swift.Error> { promise in
            Endpoint.current.webAuth
                .useLegacyAuthentication()
                .scope("openid profile email https://courier.blog/customer_id https://courier.blog/subscription_id")
                .audience(Endpoint.current.apiIdentifier)
                .start { result in
                    switch result {
                    case .failure(let error):
                        promise(.failure(error))
                    case .success(let credentials):
                        promise(.success(credentials))
                    }
            }
        }.tryMap { credentials in
            if !CredentialsManager.shared.store(credentials: credentials) {
                throw Error.storeCredentialsFailed
            }

            return credentials
        }.eraseToAnyPublisher()
    }

    enum Error: LocalizedError {
        case storeCredentialsFailed

        var errorDescription: String? {
            "Failed Storing Credentials"
        }
    }
}
