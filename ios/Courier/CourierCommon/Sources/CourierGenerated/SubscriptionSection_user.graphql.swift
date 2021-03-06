// Auto-generated by relay-compiler. Do not edit.

import Relay

public struct SubscriptionSection_user {
    public var fragmentPointer: FragmentPointer

    public init(key: SubscriptionSection_user_Key) {
        fragmentPointer = key.fragment_SubscriptionSection_user
    }

    public static var node: ReaderFragment {
        ReaderFragment(
            name: "SubscriptionSection_user",
            type: "Viewer",
            selections: [
                .field(ReaderLinkedField(
                    name: "customer",
                    concreteType: "Customer",
                    plural: false,
                    selections: [
                        .field(ReaderLinkedField(
                            name: "creditCard",
                            concreteType: "CreditCard",
                            plural: false,
                            selections: [
                                .field(ReaderScalarField(
                                    name: "brand"
                                )),
                                .field(ReaderScalarField(
                                    name: "lastFour"
                                ))
                            ]
                        ))
                    ]
                )),
                .field(ReaderLinkedField(
                    name: "subscription",
                    concreteType: "UserSubscription",
                    plural: false,
                    selections: [
                        .field(ReaderScalarField(
                            name: "status"
                        )),
                        .field(ReaderScalarField(
                            name: "periodEnd"
                        ))
                    ]
                )),
                .field(ReaderScalarField(
                    name: "subscriptionStatusOverride"
                ))
            ]
        )
    }
}

extension SubscriptionSection_user {
    public struct Data: Decodable {
        public var customer: Customer_customer?
        public var subscription: UserSubscription_subscription?
        public var subscriptionStatusOverride: SubscriptionStatus?

        public struct Customer_customer: Decodable {
            public var creditCard: CreditCard_creditCard?

            public struct CreditCard_creditCard: Decodable {
                public var brand: String
                public var lastFour: String
            }
        }

        public struct UserSubscription_subscription: Decodable {
            public var status: SubscriptionStatus
            public var periodEnd: String
        }
    }
}

public protocol SubscriptionSection_user_Key {
    var fragment_SubscriptionSection_user: FragmentPointer { get }
}

public enum SubscriptionStatus: String, Decodable, Hashable, VariableValueConvertible, ReadableScalar, CustomStringConvertible {
    case active = "ACTIVE"
    case canceled = "CANCELED"
    case expired = "EXPIRED"
    case inactive = "INACTIVE"
    public var description: String {
        rawValue
    }
}

extension SubscriptionSection_user: Relay.Fragment {}

#if canImport(RelaySwiftUI)
import RelaySwiftUI

extension SubscriptionSection_user_Key {
    public func asFragment() -> RelaySwiftUI.Fragment<SubscriptionSection_user> {
        RelaySwiftUI.Fragment<SubscriptionSection_user>(self)
    }
}
#endif