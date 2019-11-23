//
//  Tweet.swift
//  Courier
//
//  Created by Matt Moriarity on 11/11/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Foundation

extension AllTweetsFields: Identifiable {
}

extension AllTweetsFields {
    static let fakeUpcomingTweets: [AllTweetsFields] = [
        AllTweetsFields(id: "1", post: .init(id: "1", url: "https://example.com/foo"), action: .tweet, body: "This is a test tweet", mediaUrLs: [], retweetId: "", status: .draft)
    ]

    static let fakePastTweets: [AllTweetsFields] = [
        AllTweetsFields(id: "2", post: .init(id: "1", url: "https://example.com/foo"), action: .tweet, body: "This is a different tweet", mediaUrLs: [], retweetId: "", status: .canceled),
        AllTweetsFields(id: "3", post: .init(id: "1", url: "https://example.com/foo"), action: .tweet, body: "This is a different tweet", mediaUrLs: [], retweetId: "", status: .posted, postedAt: "2019-11-10T00:00:00Z"),
    ]
}

extension TweetConnectionFields {
    init(tweets: [AllTweetsFields]) throws {
        try self.init(
            nodes: tweets.map { tweet in
                var node = try TweetConnectionFields.Node(jsonObject: [:])
                node.fragments.allTweetsFields = tweet
                return node
            },
            pageInfo: .init(hasPreviousPage: false),
            totalCount: tweets.count
        )
    }
}

protocol TweetListData {
    var tweetConnectionFields: TweetConnectionFields { get set }
}

extension TweetListData {
    var nodes: [TweetConnectionFields.Node] {
        get { tweetConnectionFields.nodes }
        set { tweetConnectionFields.nodes = newValue }
    }
}

extension UpcomingTweetsQuery.Data: TweetListData {
    var tweetConnectionFields: TweetConnectionFields {
        get { allTweets.fragments.tweetConnectionFields }
        set { allTweets.fragments.tweetConnectionFields = newValue }
    }
}

extension PastTweetsQuery.Data: TweetListData {
    var tweetConnectionFields: TweetConnectionFields {
        get { allTweets.fragments.tweetConnectionFields }
        set { allTweets.fragments.tweetConnectionFields = newValue }
    }
}

private let dateFormatter: ISO8601DateFormatter = {
    let formatter = ISO8601DateFormatter()
    formatter.formatOptions.insert(.withFractionalSeconds)
    return formatter
}()

extension AllTweetsFields.Post {
    var publishedAtDate: Date? {
        publishedAt.flatMap { dateFormatter.date(from: $0) }
    }
}
