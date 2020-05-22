import SwiftUI
import RelaySwiftUI

private let userFragment = graphql("""
fragment UserProfileSection_user on Viewer {
  name
  picture
}
""")

struct UserProfileSection: View {
    @Fragment(UserProfileSection_user.self) var user
    @EnvironmentObject var authContext: AuthContext
    let onLogout: () -> Void

    init(user: UserProfileSection_user_Key, onLogout: @escaping () -> Void) {
        self.onLogout = onLogout
        self.$user = user
    }

    var body: some View {
        Section {
            if user != nil {
                HStack(spacing: 16) {
                    AsyncImage(url: URL(string: user!.picture)!, placeholder: Rectangle())
                        .frame(width: 50, height: 50)
                        .cornerRadius(8)
                    VStack(alignment: .leading, spacing: 4) {
                        Text(user!.name)
                            .font(.headline)
                        Text(authContext.userInfo?.nickname.map { "@" + $0 } ?? "Screen name unknown")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                }
                .padding(.vertical, 8)

                Button(action: onLogout, label: {
                    HStack {
                        Spacer()
                        Text("Sign Out")
                            .foregroundColor(.red)
                        Spacer()
                    }
                })
            }
        }
    }
}
