//
//  ControlEvent.swift
//  Courier
//
//  Created by Matt Moriarity on 11/14/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Combinable
import UIKit

protocol ControlEventable: class {
    func addTarget(_ target: Any?, action: Selector, for controlEvents: UIControl.Event)
    func removeTarget(_ target: Any?, action: Selector?, for controlEvents: UIControl.Event)
}

extension UIControl: ControlEventable {}

extension ControlEventable {
    func publisher(for events: UIControl.Event) -> ControlEventPublisher<Self> {
        ControlEventPublisher(control: self, events: events)
    }

    var touchedUpInside: ControlEventPublisher<Self> {
        publisher(for: .touchUpInside)
    }

    var valueDidChange: ControlEventPublisher<Self> {
        publisher(for: .valueChanged)
    }
}

struct ControlEventPublisher<Control: ControlEventable>: Publisher {
    typealias Output = (control: Control, event: UIEvent)
    typealias Failure = Never

    let control: Control
    let events: UIControl.Event

    func receive<S>(subscriber: S) where S : Subscriber, Failure == S.Failure, Output == S.Input {
        let inner = Inner(
            downstream: subscriber,
            control: control,
            events: events
        )
        subscriber.receive(subscription: inner)
    }
}

extension ControlEventPublisher {
    private final class Inner<Downstream: Subscriber>: Subscription where Downstream.Input == Output, Downstream.Failure == Failure {

        let downstream: Downstream
        let control: Control
        let events: UIControl.Event

        init(downstream: Downstream, control: Control, events: UIControl.Event) {
            self.downstream = downstream
            self.control = control
            self.events = events

            control.addTarget(self, action: #selector(performAction(sender:forEvent:)), for: events)
        }

        func request(_ demand: Subscribers.Demand) {
            // ignore demand
        }

        @objc func performAction(sender: UIControl, forEvent event: UIEvent) {
            _ = downstream.receive((control: sender as! Control, event: event))
        }

        func cancel() {
            control.removeTarget(self, action: #selector(performAction(sender:forEvent:)), for: events)
        }
    }
}
