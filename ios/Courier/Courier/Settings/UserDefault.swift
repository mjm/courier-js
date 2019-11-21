//
//  UserDefault.swift
//  Courier
//
//  Created by Matt Moriarity on 11/20/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Combinable
import Foundation

extension UserDefaults {
    class DefaultValues {
        @objc let environment = "production"
    }

    static let defaults = DefaultValues()
}

private extension KeyPath {
    var asString: String {
        NSExpression(forKeyPath: self).keyPath
    }
}

@propertyWrapper
struct UserDefault<T> {
    let suite: UserDefaults
    let key: KeyPath<UserDefaults.DefaultValues, T>

    init(_ key: KeyPath<UserDefaults.DefaultValues, T>, suite: UserDefaults = .standard) {
        self.key = key
        self.suite = suite
    }

    var wrappedValue: T {
        get {
            suite.object(forKey: key.asString) as? T ?? UserDefaults.defaults[keyPath: key]
        }
        set {
            suite.setValue(newValue, forKey: key.asString)
        }
    }

    var projectedValue: UserDefault<T>.Publisher {
        Publisher(suite: suite, key: key)
    }
}

extension UserDefault {
    struct Publisher: Combine.Publisher {
        typealias Output = T
        typealias Failure = Never

        let suite: UserDefaults
        let key: KeyPath<UserDefaults.DefaultValues, T>

        func receive<S>(subscriber: S) where S : Subscriber, Failure == S.Failure, Output == S.Input {
            let inner = Inner(downstream: subscriber, suite: suite, key: key.asString)
            subscriber.receive(subscription: inner)
        }
    }

    private final class Inner<Downstream: Subscriber>: NSObject, Subscription where Downstream.Input == T, Downstream.Failure == Never {
        let downstream: Downstream
        let suite: UserDefaults
        let key: String

        var demand: Subscribers.Demand = .none
        var bufferedValue: T?

        init(downstream: Downstream, suite: UserDefaults, key: String) {
            self.downstream = downstream
            self.suite = suite
            self.key = key
            super.init()

            suite.addObserver(self, forKeyPath: key, options: [.initial, .new], context: nil)
        }

        override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {
            guard keyPath == key else { return }

            guard let value = change?[.newKey] as? T else {
                return
            }

            bufferedValue = value
            fulfillDemand()
        }

        func request(_ demand: Subscribers.Demand) {
            self.demand += demand
            fulfillDemand()
        }

        func cancel() {
            suite.removeObserver(self, forKeyPath: key)
        }

        private func fulfillDemand() {
            if demand > .none, let value = bufferedValue {
                demand += downstream.receive(value)
                demand -= 1

                bufferedValue = nil
            }
        }
    }
}
