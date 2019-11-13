//
//  ApolloClientDelegate.swift
//  Courier
//
//  Created by Matt Moriarity on 11/10/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Apollo
import Auth0
import Foundation

extension ApolloClient {
    static let main: ApolloClient = {
        let delegate = ApolloClientDelegate(credentialsManager: .shared)
        let transport = HTTPNetworkTransport(url: Endpoint.current.url.appendingPathComponent("/graphql"), delegate: delegate)
        return ApolloClient(networkTransport: transport)
    }()
}

final class ApolloClientDelegate: HTTPNetworkTransportPreflightDelegate, HTTPNetworkTransportRetryDelegate, HTTPNetworkTransportGraphQLErrorDelegate {

    let retryQueue = DispatchQueue(label: "com.mattmoriarity.Threads.retryRequests")
    let credentialsManager: CredentialsManager

    private var credentials: Credentials?

    init(credentialsManager: CredentialsManager) {
        self.credentialsManager = credentialsManager

        getCredentials()
    }

    func networkTransport(_ networkTransport: HTTPNetworkTransport, shouldSend request: URLRequest) -> Bool {
        true
    }

    func networkTransport(_ networkTransport: HTTPNetworkTransport, willSend request: inout URLRequest) {
        if let credentials = credentials, let accessToken = credentials.accessToken {
            request.addValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        }
    }

    func networkTransport(_ networkTransport: HTTPNetworkTransport, receivedError error: Error, for request: URLRequest, response: URLResponse?, retryHandler: @escaping (Bool) -> Void) {
        print("Got error in request: \(error)")
        retryHandler(false)
    }

    func networkTransport(_ networkTransport: HTTPNetworkTransport, receivedGraphQLErrors errors: [GraphQLError], retryHandler: @escaping (Bool) -> Void) {
        print("Got GraphQL errors: \(errors)")
        let isUnauthenticated = errors.contains { ($0.extensions?["code"] as? String) == "UNAUTHENTICATED" }
        if isUnauthenticated {
            getCredentials { error in
                if error == nil {
                    retryHandler(true)
                } else {
                    self.retryQueue.asyncAfter(deadline: .now() + .seconds(30)) {
                        retryHandler(true)
                    }
                }
            }
        } else {
            retryHandler(false)
        }
    }

    private func getCredentials(completion: @escaping (Error?) -> Void = { _ in }) {
        credentialsManager.credentials { error, credentials in
            if let error = error {
                completion(error)
            } else if let credentials = credentials {
                self.credentials = credentials
                completion(nil)
            }
        }
    }
}
