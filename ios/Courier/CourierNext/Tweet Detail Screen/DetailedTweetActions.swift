import SwiftUI
import RelaySwiftUI

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
    @Fragment(DetailedTweetActions_tweetGroup.self) var tweetGroup

    @Mutation(CancelTweetMutation.self) var cancelTweet
    @Mutation(UncancelTweetMutation.self) var uncancelTweet
    @Mutation(PostTweetMutation.self) var postTweet

    @State private var isPresentingPostAlert = false

    init(tweetGroup: DetailedTweetActions_tweetGroup_Key) {
        self.tweetGroup = tweetGroup
    }

    var body: some View {
        Section(footer: sectionFooter) {
            if $tweetGroup != nil {
                if $tweetGroup!.status == .draft {
                    draftActions
                } else if $tweetGroup!.status == .canceled {
                    canceledActions
                } else if $tweetGroup!.status == .posted {
                    postedActions
                }
            }
        }
    }

    var draftActions: some View {
        Group {
            Button(action: {
                self.cancelTweet.commit(id: self.$tweetGroup!.id)
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
                            self.postTweet.commit(id: self.$tweetGroup!.id)
                        },
                        secondaryButton: .cancel())
                }
        }
    }

    var canceledActions: some View {
        Button(action: {
            self.uncancelTweet.commit(id: self.$tweetGroup!.id)
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
                Text(verbatim: "\($tweetGroup!.postedAt!.asDate!, relativeTo: Date())")
                    .foregroundColor(.secondary)
            }
            Button(action: {
                let postedID = self.$tweetGroup!.postedRetweetID ?? self.$tweetGroup!.tweets[0].postedTweetID!
                // TODO get the real screen name
                let url = URL(string: "https://twitter.com/CourierTest/status/\(postedID)")!
                UIApplication.shared.open(url, options: [:])
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
            if $tweetGroup != nil && $tweetGroup!.status == .draft && $tweetGroup!.postAfter != nil {
                Text("This tweet will post automatically ") + Text(verbatim: "\($tweetGroup!.postAfter!.asDate!, relativeTo: Date())")
            }
        }
    }
}
