//
//  Store.swift
//  Courier
//
//  Created by Matt Moriarity on 11/22/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Apollo

struct TweetLists {
    var upcoming: TweetListData
    var past: TweetListData
}

extension ApolloStore {
    func moveTweet(
        id: GraphQLID,
        from: WritableKeyPath<TweetLists, TweetListData>,
        to: WritableKeyPath<TweetLists, TweetListData>
    ) {
        let upcomingQuery = UpcomingTweetsQuery()
        let pastQuery = PastTweetsQuery()

        withinReadWriteTransaction({ t in
            var lists = try TweetLists(
                upcoming: t.read(query: upcomingQuery),
                past: t.read(query: pastQuery)
            )

            if let fromIndex = lists[keyPath: from].nodes.firstIndex(where: { $0.fragments.allTweetsFields.id == id }) {
                let theTweet = lists[keyPath: from].nodes.remove(at: fromIndex)
                let newIndex = lists[keyPath: to].nodes.firstIndex { node in
                    (node.fragments.allTweetsFields.post.publishedAtDate ?? .distantPast) < (theTweet.fragments.allTweetsFields.post.publishedAtDate ?? .distantPast)
                } ?? lists[keyPath: to].nodes.count
                lists[keyPath: to].nodes.insert(theTweet, at: newIndex)

                try t.write(data: lists.upcoming as! UpcomingTweetsQuery.Data, forQuery: upcomingQuery)
                try t.write(data: lists.past as! PastTweetsQuery.Data, forQuery: pastQuery)
            }
        }, callbackQueue: .main)
    }
}
