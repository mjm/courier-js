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
            type: "Viewer",
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
    struct Data: Decodable {
        var name: String
        var picture: String
    }
}

protocol UserProfileSection_user_Key {
    var fragment_UserProfileSection_user: FragmentPointer { get }
}

extension UserProfileSection_user: Relay.Fragment {}
