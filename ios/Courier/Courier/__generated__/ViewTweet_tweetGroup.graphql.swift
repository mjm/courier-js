// Auto-generated by relay-compiler. Do not edit.

import Relay

struct ViewTweet_tweetGroup {
    var fragmentPointer: FragmentPointer

    init(key: ViewTweet_tweetGroup_Key) {
        fragmentPointer = key.fragment_ViewTweet_tweetGroup
    }

    static var node: ReaderFragment {
        ReaderFragment(
            name: "ViewTweet_tweetGroup",
            type: "TweetGroup",
            selections: [
                .field(ReaderScalarField(
                    name: "status"
                )),
                .fragmentSpread(ReaderFragmentSpread(
                    name: "DetailedTweetList_tweetGroup"
                )),
                .fragmentSpread(ReaderFragmentSpread(
                    name: "DetailedTweetActions_tweetGroup"
                ))
            ]
        )
    }
}

extension ViewTweet_tweetGroup {
    struct Data: Decodable, DetailedTweetList_tweetGroup_Key, DetailedTweetActions_tweetGroup_Key {
        var status: TweetStatus
        var fragment_DetailedTweetList_tweetGroup: FragmentPointer
        var fragment_DetailedTweetActions_tweetGroup: FragmentPointer
    }
}

protocol ViewTweet_tweetGroup_Key {
    var fragment_ViewTweet_tweetGroup: FragmentPointer { get }
}

extension ViewTweet_tweetGroup: Relay.Fragment {}

#if swift(>=5.3) && canImport(RelaySwiftUI)
import RelaySwiftUI

extension ViewTweet_tweetGroup_Key {
    @available(iOS 14.0, macOS 10.16, tvOS 14.0, watchOS 7.0, *)
    func asFragment() -> RelaySwiftUI.FragmentNext<ViewTweet_tweetGroup> {
        RelaySwiftUI.FragmentNext<ViewTweet_tweetGroup>(self)
    }
}
#endif