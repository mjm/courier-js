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
        publisher(query: query, cachePolicy: cachePolicy, pollInterval: pollInterval, refresh: Empty())
    }

    func publisher<Query: GraphQLQuery, Refresh: Publisher>(
        query: Query,
        cachePolicy: CachePolicy = .returnCacheDataAndFetch,
        pollInterval: TimeInterval? = nil,
        refresh: Refresh
    ) -> WatchQueryPublisher<Query>
    where Refresh.Output == (), Refresh.Failure == Never {
        WatchQueryPublisher(
            client: self,
            query: query,
            cachePolicy: cachePolicy,
            pollInterval: pollInterval,
            refresh: refresh.eraseToAnyPublisher()
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
    let refresh: AnyPublisher<(), Never>

    init(
        client: ApolloClientProtocol,
        query: Query,
        cachePolicy: CachePolicy,
        pollInterval: TimeInterval?,
        refresh: AnyPublisher<(), Never>
    ) {
        self.client = client
        self.query = query
        self.cachePolicy = cachePolicy
        self.pollInterval = pollInterval
        self.refresh = refresh
    }

    func receive<S>(subscriber: S) where S : Subscriber, Failure == S.Failure, Output == S.Input {
        let inner = Inner(
            downstream: subscriber,
            client: client,
            query: query,
            cachePolicy: cachePolicy,
            pollInterval: pollInterval,
            refresh: refresh
        )
        subscriber.receive(subscription: inner)
    }
}

extension WatchQueryPublisher {
    private final class Inner<Downstream: Subscriber>: Subscription where Downstream.Input == Output, Downstream.Failure == Failure {

        let downstream: Downstream
        var watcher: GraphQLQueryWatcher<Query>!

        var cancellables = Set<AnyCancellable>()

        init(
            downstream: Downstream,
            client: ApolloClientProtocol,
            query: Query,
            cachePolicy: CachePolicy,
            pollInterval: TimeInterval?,
            refresh: AnyPublisher<(), Never>
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

            var refresher = refresh
                .merge(with: NotificationCenter.default.publisher(for: .didLogIn).map { _ in })
                .eraseToAnyPublisher()
            if let pollInterval = pollInterval {
                refresher = refresher.merge(with:
                    Timer.publish(every: pollInterval, on: .main, in: .common)
                        .autoconnect()
                        .map { _ in }
                ).eraseToAnyPublisher()
            }

            refresher.sink { [watcher] in
                watcher?.refetch()
            }.store(in: &cancellables)
        }

        func request(_ demand: Subscribers.Demand) {
            // ignore
        }

        func cancel() {
            watcher.cancel()
            cancellables.removeAll()
        }
    }
}
