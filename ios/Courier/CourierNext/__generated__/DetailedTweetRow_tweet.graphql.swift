// Auto-generated by relay-compiler. Do not edit.

import Relay

struct DetailedTweetRow_tweet {
    var fragmentPointer: FragmentPointer

    init(key: DetailedTweetRow_tweet_Key) {
        fragmentPointer = key.fragment_DetailedTweetRow_tweet
    }

    static var node: ReaderFragment {
        ReaderFragment(
            name: "DetailedTweetRow_tweet",
            selections: [
                .field(ReaderScalarField(
                    name: "body"
                )),
                .field(ReaderScalarField(
                    name: "mediaURLs"
                ))
            ])
    }
}


extension DetailedTweetRow_tweet {
    struct Data: Readable {
        var body: String
        var mediaURLs: [String]

        init(from data: SelectorData) {
            body = data.get(String.self, "body")
            mediaURLs = data.get([String].self, "mediaURLs")
        }
    }
}

protocol DetailedTweetRow_tweet_Key {
    var fragment_DetailedTweetRow_tweet: FragmentPointer { get }
}

extension DetailedTweetRow_tweet: Relay.Fragment {}
