//
//  WatchQuery.swift
//  Courier
//
//  Created by Matt Moriarity on 11/10/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Apollo
import Combinable
import Dispatch
import Foundation

extension ApolloClientProtocol {
    func publisher<Query: GraphQLQuery>(
        query: Query,
        cachePolicy: CachePolicy = .returnCacheDataAndFetch,
        pollInterval: TimeInterval? = nil
    ) -> WatchQueryPublisher<Query> {
        WatchQueryPublisher(
            client: self,
            query: query,
            cachePolicy: cachePolicy,
            pollInterval: pollInterval
        )
    }

    func publisher<Mutation: GraphQLMutation>(
        mutation: Mutation
    ) -> AnyPublisher<Mutation.Data, Error> {
        Future { promise in
            _ = self.perform(mutation: mutation, context: nil, queue: .main, resultHandler: promise)
        }.tryMap { result in
            if let error = result.errors?.first {
                throw error
            }

            return result.data!
        }.eraseToAnyPublisher()
    }
}

struct WatchQueryPublisher<Query: GraphQLQuery>: Publisher {

    typealias Output = GraphQLResult<Query.Data>
    typealias Failure = Error

    let client: ApolloClientProtocol
    let query: Query
    let cachePolicy: CachePolicy
    let pollInterval: TimeInterval?

    init(client: ApolloClientProtocol, query: Query, cachePolicy: CachePolicy, pollInterval: TimeInterval?) {
        self.client = client
        self.query = query
        self.cachePolicy = cachePolicy
        self.pollInterval = pollInterval
    }

    func receive<S>(subscriber: S) where S : Subscriber, Failure == S.Failure, Output == S.Input {
        let inner = Inner(
            downstream: subscriber,
            client: client,
            query: query,
            cachePolicy: cachePolicy,
            pollInterval: pollInterval
        )
        subscriber.receive(subscription: inner)
    }
}

extension WatchQueryPublisher {
    private final class Inner<Downstream: Subscriber>: Subscription where Downstream.Input == Output, Downstream.Failure == Failure {

        let downstream: Downstream
        var watcher: GraphQLQueryWatcher<Query>!

        var didLoginSubscription: AnyCancellable?
        var pollSubscription: AnyCancellable?

        init(
            downstream: Downstream,
            client: ApolloClientProtocol,
            query: Query,
            cachePolicy: CachePolicy,
            pollInterval: TimeInterval?
        ) {
            self.downstream = downstream
            watcher = client.watch(query: query, cachePolicy: cachePolicy, queue: .main) { [weak self] result in
                guard let self = self else { return }
                do {
                    _ = try self.downstream.receive(result.get())
                } catch {
                    self.downstream.receive(completion: .failure(error))
                    self.cancel()
                }
            }
            didLoginSubscription = NotificationCenter.default.publisher(for: .didLogIn).sink { [watcher] note in
                watcher?.refetch()
            }

            if let pollInterval = pollInterval {
                pollSubscription = Timer.publish(every: pollInterval, on: .main, in: .common).autoconnect().sink { [watcher] _ in
                    watcher?.refetch()
                }
            }
        }

        func request(_ demand: Subscribers.Demand) {
            // ignore
        }

        func cancel() {
            watcher.cancel()
            didLoginSubscription?.cancel()
            pollSubscription?.cancel()
        }
    }
}
