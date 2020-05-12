import Relay

struct UserProfileSection_user: Fragment {
    var node: ReaderFragment {
        return ReaderFragment(
            name: "UserProfileSection_user",
            selections: [
                .field(ReaderScalarField(
                    name: "name"
                )),
                .field(ReaderScalarField(
                    name: "nickname"
                )),
                .field(ReaderScalarField(
                    name: "picture"
                )),
            ]
        )
    }

    func getFragmentPointer(_ key: UserProfileSection_user_Key) -> FragmentPointer {
        return key.fragment_UserProfileSection_user
    }

    struct Data: Readable {
        var name: String
        var nickname: String
        var picture: String

        init(from data: SelectorData) {
            name = data.get(String.self, "name")
            nickname = data.get(String.self, "nickname")
            picture = data.get(String.self, "picture")
        }

    }
}

protocol UserProfileSection_user_Key {
    var fragment_UserProfileSection_user: FragmentPointer { get }
}

