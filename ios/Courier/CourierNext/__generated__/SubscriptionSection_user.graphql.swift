import Relay

struct SubscriptionSection_user: Fragment {
    var node: ReaderFragment {
        return ReaderFragment(
            name: "SubscriptionSection_user",
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
                                )),
                            ]
                        )),
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
                        )),
                    ]
                )),
                .field(ReaderScalarField(
                    name: "subscriptionStatusOverride"
                )),
            ]
        )
    }

    func getFragmentPointer(_ key: SubscriptionSection_user_Key) -> FragmentPointer {
        return key.fragment_SubscriptionSection_user
    }

    struct Data: Readable {
        var customer: Customer_customer?
        var subscription: UserSubscription_subscription?
        var subscriptionStatusOverride: SubscriptionStatus?

        init(from data: SelectorData) {
            customer = data.get(Customer_customer?.self, "customer")
            subscription = data.get(UserSubscription_subscription?.self, "subscription")
            subscriptionStatusOverride = data.get(SubscriptionStatus?.self, "subscriptionStatusOverride")
        }

        struct Customer_customer: Readable {
            var creditCard: CreditCard_creditCard?

            init(from data: SelectorData) {
                creditCard = data.get(CreditCard_creditCard?.self, "creditCard")
            }

            struct CreditCard_creditCard: Readable {
                var brand: String
                var lastFour: String

                init(from data: SelectorData) {
                    brand = data.get(String.self, "brand")
                    lastFour = data.get(String.self, "lastFour")
                }

            }
        }
        struct UserSubscription_subscription: Readable {
            var status: SubscriptionStatus
            var periodEnd: Time

            init(from data: SelectorData) {
                status = data.get(SubscriptionStatus.self, "status")
                periodEnd = data.get(Time.self, "periodEnd")
            }

        }
    }
}

enum SubscriptionStatus: String, Hashable, VariableValueConvertible, ReadableScalar, CustomStringConvertible {
    case active = "ACTIVE"
    case canceled = "CANCELED"
    case expired = "EXPIRED"
    case inactive = "INACTIVE"

    var description: String {
        rawValue
    }
}

protocol SubscriptionSection_user_Key {
    var fragment_SubscriptionSection_user: FragmentPointer { get }
}

