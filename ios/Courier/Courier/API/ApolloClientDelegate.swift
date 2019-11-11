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
        let transport = HTTPNetworkTransport(url: URL(string: "https://courier.blog/graphql")!, delegate: delegate)
        return ApolloClient(networkTransport: transport)
    }()
}

final class ApolloClientDelegate: HTTPNetworkTransportPreflightDelegate, HTTPNetworkTransportRetryDelegate {

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
    }

    private func getCredentials() {
        credentialsManager.credentials { error, credentials in
            if let error = error {
                print("Error retrieving credentials from credentials manager: \(error)")
            } else if let credentials = credentials {
                self.credentials = credentials
            }
        }
    }
}
