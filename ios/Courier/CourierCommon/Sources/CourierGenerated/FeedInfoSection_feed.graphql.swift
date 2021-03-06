// Auto-generated by relay-compiler. Do not edit.

import Relay

public struct FeedInfoSection_feed {
    public var fragmentPointer: FragmentPointer

    public init(key: FeedInfoSection_feed_Key) {
        fragmentPointer = key.fragment_FeedInfoSection_feed
    }

    public static var node: ReaderFragment {
        ReaderFragment(
            name: "FeedInfoSection_feed",
            type: "Feed",
            selections: [
                .field(ReaderScalarField(
                    name: "id"
                )),
                .field(ReaderScalarField(
                    name: "title"
                )),
                .field(ReaderScalarField(
                    name: "refreshedAt"
                )),
                .field(ReaderScalarField(
                    name: "refreshing"
                )),
                .field(ReaderScalarField(
                    name: "autopost"
                ))
            ]
        )
    }
}

extension FeedInfoSection_feed {
    public struct Data: Decodable, Identifiable {
        public var id: String
        public var title: String
        public var refreshedAt: String?
        public var refreshing: Bool
        public var autopost: Bool
    }
}

public protocol FeedInfoSection_feed_Key {
    var fragment_FeedInfoSection_feed: FragmentPointer { get }
}

extension FeedInfoSection_feed: Relay.Fragment {}

#if canImport(RelaySwiftUI)
import RelaySwiftUI

extension FeedInfoSection_feed_Key {
    public func asFragment() -> RelaySwiftUI.Fragment<FeedInfoSection_feed> {
        RelaySwiftUI.Fragment<FeedInfoSection_feed>(self)
    }
}
#endif