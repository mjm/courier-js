// Auto-generated by relay-compiler. Do not edit.

import Relay

struct TweetRow_tweetGroup {
    var fragmentPointer: FragmentPointer

    init(key: TweetRow_tweetGroup_Key) {
        fragmentPointer = key.fragment_TweetRow_tweetGroup
    }

    static var node: ReaderFragment {
        ReaderFragment(
            name: "TweetRow_tweetGroup",
            type: "TweetGroup",
            selections: [
                .field(ReaderScalarField(
                    name: "id"
                )),
                .field(ReaderScalarField(
                    name: "status"
                )),
                .field(ReaderScalarField(
                    name: "postedAt"
                )),
                .field(ReaderScalarField(
                    name: "postAfter"
                )),
                .field(ReaderLinkedField(
                    name: "tweets",
                    concreteType: "Tweet",
                    plural: true,
                    selections: [
                        .field(ReaderScalarField(
                            name: "body"
                        )),
                        .field(ReaderScalarField(
                            name: "mediaURLs"
                        ))
                    ]
                ))
            ])
    }
}


extension TweetRow_tweetGroup {
    struct Data: Decodable, Identifiable {
        var id: String
        var status: TweetStatus
        var postedAt: String?
        var postAfter: String?
        var tweets: [Tweet_tweets]

        struct Tweet_tweets: Decodable {
            var body: String
            var mediaURLs: [String]
        }
    }
}

protocol TweetRow_tweetGroup_Key {
    var fragment_TweetRow_tweetGroup: FragmentPointer { get }
}

extension TweetRow_tweetGroup: Relay.Fragment {}

#if canImport(RelaySwiftUI)

import RelaySwiftUI

extension TweetRow_tweetGroup_Key {
    @available(iOS 14.0, macOS 10.16, tvOS 14.0, watchOS 7.0, *)
    func asFragment() -> RelaySwiftUI.FragmentNext<TweetRow_tweetGroup> {
        RelaySwiftUI.FragmentNext<TweetRow_tweetGroup>(self)
    }
}

#endif
