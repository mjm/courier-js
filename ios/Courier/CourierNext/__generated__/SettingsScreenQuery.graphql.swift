import Relay

struct SettingsScreenQuery: Operation {
    var node: ConcreteRequest {
        return ConcreteRequest(
            fragment: ReaderFragment(
                name: "SettingsScreenQuery",
                selections: [
                    .field(ReaderLinkedField(
                        name: "viewer",
                        concreteType: "Viewer",
                        plural: false,
                        selections: [
                            .fragmentSpread(ReaderFragmentSpread(
                                name: "UserProfileSection_user"
                            )),
                            .fragmentSpread(ReaderFragmentSpread(
                                name: "SubscriptionSection_user"
                            )),
                        ]
                    )),
                ]
            ),
            operation: NormalizationOperation(
                name: "SettingsScreenQuery",
                selections: [
                    .field(NormalizationLinkedField(
                        name: "viewer",
                        concreteType: "Viewer",
                        plural: false,
                        selections: [
                            .field(NormalizationScalarField(
                                name: "name"
                            )),
                            .field(NormalizationScalarField(
                                name: "nickname"
                            )),
                            .field(NormalizationScalarField(
                                name: "picture"
                            )),
                            .field(NormalizationLinkedField(
                                name: "customer",
                                concreteType: "Customer",
                                plural: false,
                                selections: [
                                    .field(NormalizationLinkedField(
                                        name: "creditCard",
                                        concreteType: "CreditCard",
                                        plural: false,
                                        selections: [
                                            .field(NormalizationScalarField(
                                                name: "brand"
                                            )),
                                            .field(NormalizationScalarField(
                                                name: "lastFour"
                                            )),
                                        ]
                                    )),
                                ]
                            )),
                            .field(NormalizationLinkedField(
                                name: "subscription",
                                concreteType: "UserSubscription",
                                plural: false,
                                selections: [
                                    .field(NormalizationScalarField(
                                        name: "status"
                                    )),
                                    .field(NormalizationScalarField(
                                        name: "periodEnd"
                                    )),
                                ]
                            )),
                            .field(NormalizationScalarField(
                                name: "subscriptionStatusOverride"
                            )),
                        ]
                    )),
                ]
            ),
            params: RequestParameters(
                name: "SettingsScreenQuery",
                operationKind: .query,
                text: """
query SettingsScreenQuery {
  viewer {
    ...UserProfileSection_user
    ...SubscriptionSection_user
  }
}

fragment SubscriptionSection_user on Viewer {
  customer {
    creditCard {
      brand
      lastFour
    }
  }
  subscription {
    status
    periodEnd
  }
  subscriptionStatusOverride
}

fragment UserProfileSection_user on Viewer {
  name
  nickname
  picture
}
"""
            )
        )
    }

    struct Variables: VariableDataConvertible {

        var variableData: VariableData {
            [:]
        }
    }

    struct Data: Readable {
        var viewer: Viewer_viewer?

        init(from data: SelectorData) {
            viewer = data.get(Viewer_viewer?.self, "viewer")
        }

        struct Viewer_viewer: Readable, UserProfileSection_user_Key, SubscriptionSection_user_Key {
            var fragment_UserProfileSection_user: FragmentPointer
            var fragment_SubscriptionSection_user: FragmentPointer

            init(from data: SelectorData) {
                fragment_UserProfileSection_user = data.get(fragment: "UserProfileSection_user")
                fragment_SubscriptionSection_user = data.get(fragment: "SubscriptionSection_user")
            }

        }
    }
}

typealias Time = String
typealias Cursor = String
