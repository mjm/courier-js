//
//  TweetsViewModel.swift
//  Courier
//
//  Created by Matt Moriarity on 11/10/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Apollo
import Combinable
import UIKit

final class TweetsViewModel: ViewModel {
    enum Section {
        case upcoming
        case past
    }

    typealias Item = TweetCellViewModel

    typealias Snapshot = NSDiffableDataSourceSnapshot<Section, Item>

    @Published private(set) var upcomingTweetViewModels: [Item] = []
    @Published private(set) var pastTweetViewModels: [Item] = []

    override init(client: ApolloClient = .main) {
        super.init(client: client)

        $upcomingTweetViewModels.applyingChanges(from: upcomingTweets, keyPath: \.tweet) { [actionRunner] tweet in
            Item(tweet: tweet, actionRunner: actionRunner)
        }.assign(to: \.upcomingTweetViewModels, on: self, weak: true).store(in: &cancellables)

        $pastTweetViewModels.applyingChanges(from: pastTweets, keyPath: \.tweet) { [actionRunner] tweet in
            Item(tweet: tweet, actionRunner: actionRunner)
        }.assign(to: \.pastTweetViewModels, on: self, weak: true).store(in: &cancellables)
    }

    var snapshot: AnyPublisher<Snapshot, Never> {
        $upcomingTweetViewModels.combineLatest($pastTweetViewModels) { upcoming, past in
            var snapshot = Snapshot()

            snapshot.appendSections([.upcoming])
            snapshot.appendItems(upcoming, toSection: .upcoming)

            snapshot.appendSections([.past])
            snapshot.appendItems(past, toSection: .past)

            return snapshot
        }.eraseToAnyPublisher()
    }

    var upcomingTweets: AnyPublisher<[AllTweetsFields], Never> {
        apolloClient.publisher(query: UpcomingTweetsQuery()).map { result in
            result.data?.allTweets.fragments.tweetConnectionFields.nodes.map { $0.fragments.allTweetsFields } ?? []
        }.ignoreError().eraseToAnyPublisher()
    }

    var pastTweets: AnyPublisher<[AllTweetsFields], Never> {
        apolloClient.publisher(query: PastTweetsQuery()).map { result in
            result.data?.allTweets.fragments.tweetConnectionFields.nodes.map { $0.fragments.allTweetsFields } ?? []
        }.ignoreError().eraseToAnyPublisher()
    }

//    var upcomingTweets: AnyPublisher<[AllTweetsFields], Never> {
//        Just([
//            AllTweetsFields(id: "1", post: .init(id: "1", url: "https://example.com/foo"), action: .tweet, body: "This is a test tweet", mediaUrLs: [], retweetId: "", status: .draft)
//        ]).eraseToAnyPublisher()
//    }
//
//    var pastTweets: AnyPublisher<[AllTweetsFields], Never> {
//        Just([
//            AllTweetsFields(id: "2", post: .init(id: "1", url: "https://example.com/foo"), action: .tweet, body: "This is a different tweet", mediaUrLs: [], retweetId: "", status: .canceled),
//            AllTweetsFields(id: "2", post: .init(id: "1", url: "https://example.com/foo"), action: .tweet, body: "This is a different tweet", mediaUrLs: [], retweetId: "", status: .posted, postedAt: "2019-11-10T00:00:00Z"),
//        ]).eraseToAnyPublisher()
//    }
}
