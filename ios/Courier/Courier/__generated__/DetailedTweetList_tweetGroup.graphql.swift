// Auto-generated by relay-compiler. Do not edit.

import Relay

struct DetailedTweetList_tweetGroup {
    var fragmentPointer: FragmentPointer

    init(key: DetailedTweetList_tweetGroup_Key) {
        fragmentPointer = key.fragment_DetailedTweetList_tweetGroup
    }

    static var node: ReaderFragment {
        ReaderFragment(
            name: "DetailedTweetList_tweetGroup",
            type: "TweetGroup",
            selections: [
                .field(ReaderLinkedField(
                    name: "tweets",
                    concreteType: "Tweet",
                    plural: true,
                    selections: [
                        .field(ReaderScalarField(
                            name: "body"
                        )),
                        .fragmentSpread(ReaderFragmentSpread(
                            name: "DetailedTweetRow_tweet"
                        ))
                    ]
                ))
            ]
        )
    }
}

extension DetailedTweetList_tweetGroup {
    struct Data: Decodable {
        var tweets: [Tweet_tweets]

        struct Tweet_tweets: Decodable, DetailedTweetRow_tweet_Key {
            var body: String
            var fragment_DetailedTweetRow_tweet: FragmentPointer
        }
    }
}

protocol DetailedTweetList_tweetGroup_Key {
    var fragment_DetailedTweetList_tweetGroup: FragmentPointer { get }
}

extension DetailedTweetList_tweetGroup: Relay.Fragment {}

#if swift(>=5.3) && canImport(RelaySwiftUI)
import RelaySwiftUI

extension DetailedTweetList_tweetGroup_Key {
    @available(iOS 14.0, macOS 10.16, tvOS 14.0, watchOS 7.0, *)
    func asFragment() -> RelaySwiftUI.FragmentNext<DetailedTweetList_tweetGroup> {
        RelaySwiftUI.FragmentNext<DetailedTweetList_tweetGroup>(self)
    }
}
#endif