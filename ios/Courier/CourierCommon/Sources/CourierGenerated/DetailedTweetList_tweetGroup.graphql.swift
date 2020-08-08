// Auto-generated by relay-compiler. Do not edit.

import Relay

public struct DetailedTweetList_tweetGroup {
    public var fragmentPointer: FragmentPointer

    public init(key: DetailedTweetList_tweetGroup_Key) {
        fragmentPointer = key.fragment_DetailedTweetList_tweetGroup
    }

    public static var node: ReaderFragment {
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
    public struct Data: Decodable {
        public var tweets: [Tweet_tweets]

        public struct Tweet_tweets: Decodable, DetailedTweetRow_tweet_Key {
            public var body: String
            public var fragment_DetailedTweetRow_tweet: FragmentPointer
        }
    }
}

public protocol DetailedTweetList_tweetGroup_Key {
    var fragment_DetailedTweetList_tweetGroup: FragmentPointer { get }
}

extension DetailedTweetList_tweetGroup: Relay.Fragment {}

#if swift(>=5.3) && canImport(RelaySwiftUI)
import RelaySwiftUI

extension DetailedTweetList_tweetGroup_Key {
    @available(iOS 14.0, macOS 10.16, tvOS 14.0, watchOS 7.0, *)
    public func asFragment() -> RelaySwiftUI.FragmentNext<DetailedTweetList_tweetGroup> {
        RelaySwiftUI.FragmentNext<DetailedTweetList_tweetGroup>(self)
    }
}
#endif