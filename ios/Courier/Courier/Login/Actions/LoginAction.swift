//
//  LoginAction.swift
//  Courier
//
//  Created by Matt Moriarity on 11/10/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Auth0
import Combinable
import PushNotifications
import UserActions

extension Notification.Name {
    static let didLogIn = Notification.Name("CourierDidLogIn")
}

struct LoginAction: ReactiveUserAction {
    typealias ResultType = Credentials

    var undoActionName: String? { nil }

    func publisher(context: UserActions.Context<LoginAction>) -> AnyPublisher<Credentials, Swift.Error> {
        let credsPublisher: AnyPublisher<Credentials, Swift.Error>
        if CredentialsManager.shared.hasValid() {
            credsPublisher = getCurrentCredentials()
        } else {
            credsPublisher = authenticate()
        }

        return credsPublisher.flatMap { credentials in
            return self.registerUserID(creds: credentials)
        }.tryMap { credentials in
            if !CredentialsManager.shared.store(credentials: credentials) {
                throw Error.storeCredentialsFailed
            }

            NotificationCenter.default.post(name: .didLogIn, object: nil)
            return credentials
        }.eraseToAnyPublisher()
    }

    private func authenticate() -> AnyPublisher<Credentials, Swift.Error> {
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
        }.eraseToAnyPublisher()
    }

    private func getCurrentCredentials() -> AnyPublisher<Credentials, Swift.Error> {
        Future<Credentials, Swift.Error> { promise in
            CredentialsManager.shared.credentials { error, creds in
                if let error = error {
                    promise(.failure(error))
                } else if let creds = creds {
                    promise(.success(creds))
                }
            }
        }.eraseToAnyPublisher()
    }

    private func registerUserID(creds: Credentials) -> AnyPublisher<Credentials, Swift.Error> {
        Future<Credentials, Swift.Error> { promise in
            Endpoint.current.authentication.userInfo(withAccessToken: creds.accessToken!)
                .start { result in
                    switch result {
                    case .failure(let error):
                        promise(.failure(error))
                    case .success(let info):
                        Endpoint.current.pushNotifications.setUserId(info.sub, tokenProvider: BeamsTokenProvider.shared) { error in
                            if let error = error {
                                promise(.failure(error))
                            } else {
                                promise(.success(creds))
                            }
                        }
                    }
                }
        }.eraseToAnyPublisher()
    }

    enum Error: LocalizedError {
        case storeCredentialsFailed

        var errorDescription: String? {
            "Failed Storing Credentials"
        }
    }
}
