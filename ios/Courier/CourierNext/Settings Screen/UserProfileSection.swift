import SwiftUI
import RelaySwiftUI

private let userFragment = graphql("""
fragment UserProfileSection_user on Viewer {
  name
  nickname
  picture
}
""")

struct UserProfileSection: View {
    let user: UserProfileSection_user_Key

    var body: some View {
        RelayFragment(fragment: UserProfileSection_user(), key: user, content: Content.init)
    }

    struct Content: View {
        let data: UserProfileSection_user.Data?

        var body: some View {
            Section(header: Text("YOUR PROFILE")) {
                if data != nil {
                    HStack(spacing: 16) {
                        AsyncImage(url: URL(string: data!.picture)!, placeholder: Rectangle())
                            .frame(width: 50, height: 50)
                            .cornerRadius(8)
                        VStack(alignment: .leading, spacing: 4) {
                            Text(data!.name)
                                .font(.headline)
                            Text("@" + data!.nickname)
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                        }
                    }
                    .padding(.vertical, 8)
                }
            }
        }
    }
}
