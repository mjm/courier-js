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

extension ApolloClientProtocol {
    func publisher<Query: GraphQLQuery>(
        query: Query,
        cachePolicy: CachePolicy = .returnCacheDataAndFetch
    ) -> WatchQueryPublisher<Query> {
        WatchQueryPublisher(client: self, query: query, cachePolicy: cachePolicy)
    }

    func publisher<Mutation: GraphQLMutation>(
        mutation: Mutation
    ) -> AnyPublisher<GraphQLResult<Mutation.Data>, Error> {
        Future { promise in
            _ = self.perform(mutation: mutation, context: nil, queue: .main, resultHandler: promise)
        }.eraseToAnyPublisher()
    }
}

struct WatchQueryPublisher<Query: GraphQLQuery>: Publisher {

    typealias Output = GraphQLResult<Query.Data>
    typealias Failure = Error

    let client: ApolloClientProtocol
    let query: Query
    let cachePolicy: CachePolicy

    init(client: ApolloClientProtocol, query: Query, cachePolicy: CachePolicy) {
        self.client = client
        self.query = query
        self.cachePolicy = cachePolicy
    }

    func receive<S>(subscriber: S) where S : Subscriber, Failure == S.Failure, Output == S.Input {
        let inner = Inner(
            downstream: subscriber,
            client: client,
            query: query,
            cachePolicy: cachePolicy
        )
        subscriber.receive(subscription: inner)
    }
}

extension WatchQueryPublisher {
    private final class Inner<Downstream: Subscriber>: Subscription where Downstream.Input == Output, Downstream.Failure == Failure {

        let downstream: Downstream
        var watcher: GraphQLQueryWatcher<Query>!

        init(
            downstream: Downstream,
            client: ApolloClientProtocol,
            query: Query,
            cachePolicy: CachePolicy
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
        }

        func request(_ demand: Subscribers.Demand) {
            // ignore
        }

        func cancel() {
            watcher.cancel()
        }
    }
}
