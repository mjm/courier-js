import Relay

struct TweetRow_tweetGroup: Fragment {
    var node: ReaderFragment {
        return ReaderFragment(
            name: "TweetRow_tweetGroup",
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
                        )),
                    ]
                )),
            ]
        )
    }

    func getFragmentPointer(_ key: TweetRow_tweetGroup_Key) -> FragmentPointer {
        return key.fragment_TweetRow_tweetGroup
    }

    struct Data: Readable {
        var id: String
        var status: TweetStatus
        var postedAt: Time?
        var tweets: [Tweet_tweets]

        init(from data: SelectorData) {
            id = data.get(String.self, "id")
            status = data.get(TweetStatus.self, "status")
            postedAt = data.get(Time?.self, "postedAt")
            tweets = data.get([Tweet_tweets].self, "tweets")
        }

        struct Tweet_tweets: Readable {
            var body: String
            var mediaURLs: [String]

            init(from data: SelectorData) {
                body = data.get(String.self, "body")
                mediaURLs = data.get([String].self, "mediaURLs")
            }

        }
    }
}

protocol TweetRow_tweetGroup_Key {
    var fragment_TweetRow_tweetGroup: FragmentPointer { get }
}

