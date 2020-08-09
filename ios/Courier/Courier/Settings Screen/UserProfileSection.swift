import SwiftUI
import RelaySwiftUI
import CourierGenerated

private let userFragment = graphql("""
fragment UserProfileSection_user on Viewer {
  name
  picture
}
""")

struct UserProfileSection: View {
    @Fragment<UserProfileSection_user> var user
    @EnvironmentObject var authContext: AuthContext
    let onLogout: () -> Void

    var body: some View {
        Section {
            if let user = user {
                HStack(spacing: 16) {
                    AsyncImage(url: URL(string: user.picture)!, placeholder: Rectangle())
                        .frame(width: 50, height: 50)
                        .cornerRadius(8)
                    VStack(alignment: .leading, spacing: 4) {
                        Text(user.name)
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
