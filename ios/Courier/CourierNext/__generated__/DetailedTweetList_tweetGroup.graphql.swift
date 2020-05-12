import Relay

struct DetailedTweetList_tweetGroup: Fragment {
    var node: ReaderFragment {
        return ReaderFragment(
            name: "DetailedTweetList_tweetGroup",
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
                        )),
                    ]
                )),
            ]
        )
    }

    func getFragmentPointer(_ key: DetailedTweetList_tweetGroup_Key) -> FragmentPointer {
        return key.fragment_DetailedTweetList_tweetGroup
    }

    struct Data: Readable {
        var tweets: [Tweet_tweets]

        init(from data: SelectorData) {
            tweets = data.get([Tweet_tweets].self, "tweets")
        }

        struct Tweet_tweets: Readable, DetailedTweetRow_tweet_Key {
            var body: String
            var fragment_DetailedTweetRow_tweet: FragmentPointer

            init(from data: SelectorData) {
                body = data.get(String.self, "body")
                fragment_DetailedTweetRow_tweet = data.get(fragment: "DetailedTweetRow_tweet")
            }

        }
    }
}

protocol DetailedTweetList_tweetGroup_Key {
    var fragment_DetailedTweetList_tweetGroup: FragmentPointer { get }
}

