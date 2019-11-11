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

        $upcomingTweetViewModels.combineLatest(upcomingTweets) { [actionRunner] models, tweets in
            let diff = tweets.difference(from: models.map { $0.tweet }) { $0.id == $1.id }

            var newModels = models

            for change in diff {
                switch change {
                case .remove(let index, _, _):
                    newModels.remove(at: index)
                case .insert(let index, let tweet, _):
                    newModels.insert(Item(tweet: tweet, actionRunner: actionRunner), at: index)
                }
            }

            // update tweets for existing models
            for (model, tweet) in zip(newModels, tweets) {
                model.tweet = tweet
            }

            return newModels
        }.assign(to: \.upcomingTweetViewModels, on: self, weak: true).store(in: &cancellables)

        $pastTweetViewModels.combineLatest(pastTweets) { [actionRunner] models, tweets in
            let diff = tweets.difference(from: models.map { $0.tweet }) { $0.id == $1.id }

            var newModels = models

            for change in diff {
                switch change {
                case .remove(let index, _, _):
                    newModels.remove(at: index)
                case .insert(let index, let tweet, _):
                    newModels.insert(Item(tweet: tweet, actionRunner: actionRunner), at: index)
                }
            }

            // update tweets for existing models
            for (model, tweet) in zip(newModels, tweets) {
                model.tweet = tweet
            }

            return newModels
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
}
