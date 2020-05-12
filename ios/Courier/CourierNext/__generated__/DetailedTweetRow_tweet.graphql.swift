import Relay

struct DetailedTweetRow_tweet: Fragment {
    var node: ReaderFragment {
        return ReaderFragment(
            name: "DetailedTweetRow_tweet",
            selections: [
                .field(ReaderScalarField(
                    name: "body"
                )),
                .field(ReaderScalarField(
                    name: "mediaURLs"
                )),
            ]
        )
    }

    func getFragmentPointer(_ key: DetailedTweetRow_tweet_Key) -> FragmentPointer {
        return key.fragment_DetailedTweetRow_tweet
    }

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

