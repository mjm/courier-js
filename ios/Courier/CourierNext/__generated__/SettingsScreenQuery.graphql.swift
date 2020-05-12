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
  }
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

        struct Viewer_viewer: Readable, UserProfileSection_user_Key {
            var fragment_UserProfileSection_user: FragmentPointer

            init(from data: SelectorData) {
                fragment_UserProfileSection_user = data.get(fragment: "UserProfileSection_user")
            }

        }
    }
}

typealias Time = String
typealias Cursor = String
