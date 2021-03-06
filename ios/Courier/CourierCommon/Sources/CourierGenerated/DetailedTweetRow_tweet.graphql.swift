// Auto-generated by relay-compiler. Do not edit.

import Relay

public struct DetailedTweetRow_tweet {
    public var fragmentPointer: FragmentPointer

    public init(key: DetailedTweetRow_tweet_Key) {
        fragmentPointer = key.fragment_DetailedTweetRow_tweet
    }

    public static var node: ReaderFragment {
        ReaderFragment(
            name: "DetailedTweetRow_tweet",
            type: "Tweet",
            selections: [
                .field(ReaderScalarField(
                    name: "body"
                )),
                .field(ReaderScalarField(
                    name: "mediaURLs"
                ))
            ]
        )
    }
}

extension DetailedTweetRow_tweet {
    public struct Data: Decodable {
        public var body: String
        public var mediaURLs: [String]
    }
}

public protocol DetailedTweetRow_tweet_Key {
    var fragment_DetailedTweetRow_tweet: FragmentPointer { get }
}

extension DetailedTweetRow_tweet: Relay.Fragment {}

#if canImport(RelaySwiftUI)
import RelaySwiftUI

extension DetailedTweetRow_tweet_Key {
    public func asFragment() -> RelaySwiftUI.Fragment<DetailedTweetRow_tweet> {
        RelaySwiftUI.Fragment<DetailedTweetRow_tweet>(self)
    }
}
#endif