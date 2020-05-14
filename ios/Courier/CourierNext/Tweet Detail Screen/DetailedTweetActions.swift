import SwiftUI
import RelaySwiftUI

private let tweetGroupFragment = graphql("""
fragment DetailedTweetActions_tweetGroup on TweetGroup {
  id
  status
}
""")

struct DetailedTweetActions: View {
    @Fragment(DetailedTweetActions_tweetGroup.self) var tweetGroup

    @Mutation(CancelTweetMutation.self) var cancelTweet

    init(tweetGroup: DetailedTweetActions_tweetGroup_Key) {
        self.tweetGroup = tweetGroup
    }

    var body: some View {
        Section {
            if $tweetGroup != nil {
                if $tweetGroup!.status == .draft {
                    Button(action: {
                        let input = CancelTweetInput(id: self.$tweetGroup!.id)
                        self.cancelTweet.commit(variables: .init(input: input))
                    }) {
                        HStack {
                            Spacer()
                            Text("Don't Post")
                            Spacer()
                        }
                    }.disabled(self.cancelTweet.isInFlight)

                    Button(action: {

                    }) {
                        HStack {
                            Spacer()
                            Text("Post Now")
                            Spacer()
                        }
                    }.disabled(true)
                } else if $tweetGroup!.status == .canceled {
                    Button(action: {

                    }) {
                        HStack {
                            Spacer()
                            Text("Restore Draft")
                            Spacer()
                        }
                    }
                }
            }
        }
    }
}
