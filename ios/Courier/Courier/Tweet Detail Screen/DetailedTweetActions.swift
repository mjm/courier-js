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
        Section(footer: sectionFooter) {
            if let tweetGroup = tweetGroup {
                switch tweetGroup.status {
                case .draft:
                    draftActions
                case .canceled:
                    canceledActions
                case .posted:
                    postedActions
                }
            }
        }
    }

    var draftActions: some View {
        Group {
            Button(action: {
                self.cancelTweet.commit(id: self.tweetGroup!.id)
            }) {
                HStack {
                    Spacer()
                    Text("Don't Post").foregroundColor(self.cancelTweet.isInFlight ? .secondary : .red)
                    Spacer()
                }
            }.disabled(self.cancelTweet.isInFlight)

            Button(action: {
                self.isPresentingPostAlert = true
            }) {
                HStack {
                    Spacer()
                    Text("Post Now")
                    Spacer()
                }
            }
                .disabled(self.postTweet.isInFlight)
                .alert(isPresented: $isPresentingPostAlert) {
                    Alert(
                        title: Text("Post Tweet Now?"),
                        message: Text("Do you want to post this tweet to Twitter?"),
                        primaryButton: .default(Text("Post Now")) {
                            self.postTweet.commit(id: self.tweetGroup!.id)
                        },
                        secondaryButton: .cancel())
                }
        }
    }

    var canceledActions: some View {
        Button(action: {
            self.uncancelTweet.commit(id: self.tweetGroup!.id)
        }) {
            HStack {
                Spacer()
                Text("Restore Draft")
                Spacer()
            }
        }.disabled(self.uncancelTweet.isInFlight)
    }

    var postedActions: some View {
        Group {
            HStack {
                Text("Posted")
                Spacer()
                (Text(tweetGroup!.postedAt!.asDate!, style: .relative) + Text(" ago"))
                    .foregroundColor(.secondary)
            }
            Button(action: {
                let postedID = self.tweetGroup!.postedRetweetID ?? self.tweetGroup!.tweets[0].postedTweetID!
                let url = URL(string: "https://twitter.com/\(self.authContext.userInfo?.nickname ?? "unknown")/status/\(postedID)")!
                openURL(url)
            }) {
                HStack {
                    Spacer()
                    Text("View on Twitter")
                    Spacer()
                }
            }
        }
    }

    var sectionFooter: some View {
        Group {
            if tweetGroup != nil && tweetGroup!.status == .draft && tweetGroup!.postAfter != nil {
                Text("This tweet will post automatically in ") + Text(tweetGroup!.postAfter!.asDate!, style: .relative)
            }
        }
    }
}
