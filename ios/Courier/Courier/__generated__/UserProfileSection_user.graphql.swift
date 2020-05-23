// Auto-generated by relay-compiler. Do not edit.

import Relay

struct UserProfileSection_user {
    var fragmentPointer: FragmentPointer

    init(key: UserProfileSection_user_Key) {
        fragmentPointer = key.fragment_UserProfileSection_user
    }

    static var node: ReaderFragment {
        ReaderFragment(
            name: "UserProfileSection_user",
            selections: [
                .field(ReaderScalarField(
                    name: "name"
                )),
                .field(ReaderScalarField(
                    name: "picture"
                ))
            ])
    }
}


extension UserProfileSection_user {
    struct Data: Readable {
        var name: String
        var picture: String

        init(from data: SelectorData) {
            name = data.get(String.self, "name")
            picture = data.get(String.self, "picture")
        }
    }
}

protocol UserProfileSection_user_Key {
    var fragment_UserProfileSection_user: FragmentPointer { get }
}

extension UserProfileSection_user: Relay.Fragment {}
