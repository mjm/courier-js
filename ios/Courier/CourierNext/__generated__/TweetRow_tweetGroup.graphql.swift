import Relay

struct TweetRow_tweetGroup: Fragment {
    var node: ReaderFragment {
        return ReaderFragment(
            name: "TweetRow_tweetGroup",
            selections: [
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
        var status: TweetStatus
        var postedAt: Time?
        var tweets: [Tweet_tweets]

        init(from data: SelectorData) {
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

enum TweetStatus: String, Hashable, VariableValueConvertible, ReadableScalar, CustomStringConvertible {
    case draft = "DRAFT"
    case canceled = "CANCELED"
    case posted = "POSTED"

    var description: String {
        rawValue
    }
}

protocol TweetRow_tweetGroup_Key {
    var fragment_TweetRow_tweetGroup: FragmentPointer { get }
}

