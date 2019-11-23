//
//  All.swift
//  Courier
//
//  Created by Matt Moriarity on 11/23/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Combinable

extension Publisher {
    func all<NewPublisher: Publisher, Elem>(
        _ transform: @escaping (Output.Element) -> NewPublisher
    ) -> AllPublisher<NewPublisher, Self, Elem> where Output: Collection, NewPublisher.Output == Optional<Elem> {
        AllPublisher(
            upstream: self,
            transform: transform
        )
    }
}

struct AllPublisher<NewPublisher: Publisher, Upstream: Publisher, Elem>: Publisher where NewPublisher.Failure == Upstream.Failure, NewPublisher.Output == Optional<Elem>, Upstream.Output: Collection {
    typealias Output = [NewPublisher.Output]
    typealias Failure = Upstream.Failure

    typealias Transform = (Upstream.Output.Element) -> NewPublisher

    let upstream: Upstream
    let transform: Transform

    func receive<S>(subscriber: S) where S : Subscriber, Failure == S.Failure, Output == S.Input {
        let inner = Inner(downstream: subscriber, upstream: upstream, transform: transform)
        subscriber.receive(subscription: inner)
    }
}

extension AllPublisher {
    enum Status {
        case waiting
        case subscribed(AnyCancellable)
        case finished
    }

    private final class Inner<Downstream: Subscriber>: Subscription where Downstream.Input == Output, Downstream.Failure == Failure {
        let downstream: Downstream
        let upstream: Upstream
        let transform: Transform

        var status = Status.waiting
        var demand: Subscribers.Demand = .none

        var subscriptions = [AnyCancellable]()

        var items: [Elem?] = []
        var hasItemChanges = false

        init(
            downstream: Downstream,
            upstream: Upstream,
            transform: @escaping Transform
        ) {
            self.downstream = downstream
            self.upstream = upstream
            self.transform = transform
        }

        func request(_ demand: Subscribers.Demand) {
            self.demand += demand
            subscribeIfNeeded()
            fulfillDemand()
        }

        func cancel() {
            subscriptions.removeAll()
            status = .finished
        }

        private func subscribeIfNeeded() {
            if case .waiting = status {
                let subscription = upstream.sink(receiveCompletion: { [weak self] completion in
                    self?.downstream.receive(completion: completion)
                    self?.cancel()
                }) { [weak self] items in
                    guard let self = self else { return }

                    self.subscriptions.removeAll()
                    self.items = items.map { _ in nil }
                    self.hasItemChanges = true

                    for (i, item) in items.enumerated() {
                        self.transform(item).sink(receiveCompletion: { completion in
                            if case .failure = completion {
                                self.downstream.receive(completion: completion)
                                self.cancel()
                            }
                        }) { [weak self] elem in
                            guard let self = self else { return }

                            self.items[i] = elem
                            self.hasItemChanges = true
                            self.fulfillDemand()
                        }.store(in: &self.subscriptions)
                    }

                    self.fulfillDemand()
                }

                status = .subscribed(subscription)
            }
        }

        private func fulfillDemand() {
            if demand > .none, hasItemChanges {
                demand += downstream.receive(items)
                demand -= 1
                hasItemChanges = false
            }
        }
    }
}
