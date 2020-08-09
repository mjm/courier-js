import SwiftUI
import RelaySwiftUI
import CourierGenerated

private let tweetGroupFragment = graphql("""
fragment DetailedTweetActions_tweetGroup on TweetGroup {
  tweets {
    postedTweetID
  }
  id
  status
  postAfter
  postedAt
  postedRetweetID
}
""")

struct DetailedTweetActions: View {
    @Fragment<DetailedTweetActions_tweetGroup> var tweetGroup

    @Mutation(CancelTweetMutation.self) var cancelTweet
    @Mutation(UncancelTweetMutation.self) var uncancelTweet
    @Mutation(PostTweetMutation.self) var postTweet

    @EnvironmentObject var authContext: AuthContext
    
    @Environment(\.openURL) var openURL

    @State private var isPresentingPostAlert = false

    var body: some View {
        if let tweetGroup = tweetGroup {
            Section(footer: sectionFooter(tweetGroup)) {
                switch tweetGroup.status {
                case .draft:
                    draftActions(tweetGroup)
                case .canceled:
                    canceledActions(tweetGroup)
                case .posted:
                    postedActions(tweetGroup)
                }
            }
        }
    }

    @ViewBuilder func draftActions(_ tweetGroup: DetailedTweetActions_tweetGroup.Data) -> some View {
        Button {
            cancelTweet.commit(id: tweetGroup.id)
        } label: {
            HStack {
                Spacer()
                Text("Don't Post").foregroundColor(cancelTweet.isInFlight ? .secondary : .red)
                Spacer()
            }
        }
        .disabled(cancelTweet.isInFlight)

        Button {
            isPresentingPostAlert = true
        } label: {
            HStack {
                Spacer()
                Text("Post Now")
                Spacer()
            }
        }
        .disabled(postTweet.isInFlight)
        .alert(isPresented: $isPresentingPostAlert) {
            Alert(
                title: Text("Post Tweet Now?"),
                message: Text("Do you want to post this tweet to Twitter?"),
                primaryButton: .default(Text("Post Now")) {
                    postTweet.commit(id: tweetGroup.id)
                },
                secondaryButton: .cancel()
            )
        }
    }

    @ViewBuilder func canceledActions(_ tweetGroup: DetailedTweetActions_tweetGroup.Data) -> some View {
        Button {
            uncancelTweet.commit(id: tweetGroup.id)
        } label: {
            HStack {
                Spacer()
                Text("Restore Draft")
                Spacer()
            }
        }
        .disabled(uncancelTweet.isInFlight)
    }

    @ViewBuilder func postedActions(_ tweetGroup: DetailedTweetActions_tweetGroup.Data) -> some View {
        HStack {
            Text("Posted")
            Spacer()
            (Text(tweetGroup.postedAt!.asDate!, style: .relative) + Text(" ago"))
                .foregroundColor(.secondary)
        }

        Button {
            let postedID = tweetGroup.postedRetweetID ?? tweetGroup.tweets[0].postedTweetID!
            let url = URL(string: "https://twitter.com/\(authContext.userInfo?.nickname ?? "unknown")/status/\(postedID)")!
            openURL(url)
        } label: {
            HStack {
                Spacer()
                Text("View on Twitter")
                Spacer()
            }
        }
    }

    @ViewBuilder func sectionFooter(_ tweetGroup: DetailedTweetActions_tweetGroup.Data) -> some View {
        if tweetGroup.status == .draft && tweetGroup.postAfter != nil {
            Text("This tweet will post automatically in ") + Text(tweetGroup.postAfter!.asDate!, style: .relative)
        }
    }
}
