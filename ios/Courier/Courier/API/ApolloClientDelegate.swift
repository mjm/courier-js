//
//  ApolloClientDelegate.swift
//  Courier
//
//  Created by Matt Moriarity on 11/10/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Apollo
import ApolloSQLite
import Auth0
import Combinable
import Events
import Foundation

extension ApolloClient {
    static let main: ApolloClient = {
        var event = EventBuilder()

        let delegate = ApolloClientDelegate(credentialsManager: .shared)
        let apiURL = Endpoint.current.url
        event[.apiURL] = apiURL

        let transport = HTTPNetworkTransport(url: apiURL, delegate: delegate)

        let cache: NormalizedCache
        do {
            let cachesURL = try FileManager.default.url(for: .cachesDirectory, in: .userDomainMask, appropriateFor: nil, create: true)
            let cacheURL = cachesURL.appendingPathComponent("ApolloCache.db")
            event[.cacheURL] = cacheURL

            cache = try SQLiteNormalizedCache(fileURL: cacheURL)
            event[.cacheType] = "sqlite"
        } catch {
            event.error = error
            cache = InMemoryNormalizedCache()
            event[.cacheType] = "in-memory"
        }

        let store = ApolloStore(cache: cache)
        store.cacheKeyForObject = { obj in
            if let typename = obj["__typename"] as? String, let id = obj["id"] as? String {
                return "\(typename)__\(id)"
            }

            return nil
        }

        let client = ApolloClient(networkTransport: transport, store: store)
        event.send("create apollo client")

        return client
    }()
}

final class ApolloClientDelegate: HTTPNetworkTransportPreflightDelegate, HTTPNetworkTransportRetryDelegate, HTTPNetworkTransportGraphQLErrorDelegate {

    let retryQueue = DispatchQueue(label: "com.mattmoriarity.Threads.retryRequests")
    let credentialsManager: CredentialsManager

    private var credentials: Credentials?
    private var cancellables = Set<AnyCancellable>()

    init(credentialsManager: CredentialsManager) {
        self.credentialsManager = credentialsManager

        getCredentials()

        // clear out cached credentials when the user logs out
        NotificationCenter.default.publisher(for: .didLogOut).sink { [weak self] _ in
            self?.credentials = nil
        }.store(in: &cancellables)
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
        let unauthenticated = errors.first { ($0.extensions?["code"] as? String) == "UNAUTHENTICATED" }
        if unauthenticated != nil {
            getCredentials { error in
                if error == nil {
                    retryHandler(true)
                } else {
                    retryHandler(false)
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

extension GraphQLError {
    var path: [String]? {
        return self["path"] as? [String]
    }
}
