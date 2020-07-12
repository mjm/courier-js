// Auto-generated by relay-compiler. Do not edit.

import Relay

struct SubscriptionSection_user {
    var fragmentPointer: FragmentPointer

    init(key: SubscriptionSection_user_Key) {
        fragmentPointer = key.fragment_SubscriptionSection_user
    }

    static var node: ReaderFragment {
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
            ])
    }
}


extension SubscriptionSection_user {
    struct Data: Decodable {
        var customer: Customer_customer?
        var subscription: UserSubscription_subscription?
        var subscriptionStatusOverride: SubscriptionStatus?

        struct Customer_customer: Decodable {
            var creditCard: CreditCard_creditCard?

            struct CreditCard_creditCard: Decodable {
                var brand: String
                var lastFour: String
            }
        }

        struct UserSubscription_subscription: Decodable {
            var status: SubscriptionStatus
            var periodEnd: String
        }
    }
}

protocol SubscriptionSection_user_Key {
    var fragment_SubscriptionSection_user: FragmentPointer { get }
}

enum SubscriptionStatus: String, Decodable, Hashable, VariableValueConvertible, ReadableScalar, CustomStringConvertible {
    case active = "ACTIVE"
    case canceled = "CANCELED"
    case expired = "EXPIRED"
    case inactive = "INACTIVE"

    var description: String { rawValue }
}

extension SubscriptionSection_user: Relay.Fragment {}

#if swift(>=5.3) && canImport(RelaySwiftUI)

import RelaySwiftUI

extension SubscriptionSection_user_Key {
    @available(iOS 14.0, macOS 10.16, tvOS 14.0, watchOS 7.0, *)
    func asFragment() -> RelaySwiftUI.FragmentNext<SubscriptionSection_user> {
        RelaySwiftUI.FragmentNext<SubscriptionSection_user>(self)
    }
}

#endif
