//
//  TweetDetailViewModel.swift
//  Courier
//
//  Created by Matt Moriarity on 11/12/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Apollo
import Combinable
import UIKit
import UserActions

final class TweetDetailViewModel: ViewModel {
    enum Section {
        case content
    }

    enum Item: Hashable {
        case body(TweetBodyCellViewModel)
    }

    typealias Snapshot = NSDiffableDataSourceSnapshot<Section, Item>

    @Published var tweetId: GraphQLID?
    @Published private(set) var tweet: AllTweetsFields?

    var bodyViewModel = TweetBodyCellViewModel()

    private var tweetSubscription: AnyCancellable?

    init(tweetId: GraphQLID? = nil, client: ApolloClient = .main) {
        self.tweetId = tweetId
        super.init(client: client)

        $tweetId.removeDuplicates().sink { [weak self] tweetId in
            guard let self = self else { return }

            // clear out stale data
            self.tweet = nil

            guard let tweetId = tweetId else {
                return
            }

            self.tweetSubscription = self.apolloClient.publisher(query: GetTweetQuery(id: tweetId))
                .ignoreError()
                .map { result in result.data?.tweet?.fragments.allTweetsFields }
                .print()
                .assign(to: \.tweet, on: self, weak: true)
        }.store(in: &cancellables)

        $tweet.removeDuplicates { $0?.id == $1?.id }.map { $0?.body }.assign(to: \.body, on: bodyViewModel).store(in: &cancellables)
    }

    var title: AnyPublisher<String?, Never> {
        $tweet.map { ($0?.body.prefix(20)).flatMap(String.init) }.eraseToAnyPublisher()
    }

    var snapshot: AnyPublisher<Snapshot, Never> {
        $tweet.combineLatest(bodyViewModel.$body) { [bodyViewModel] tweet, _ in
            var snapshot = Snapshot()

            if tweet != nil {
                snapshot.appendSections([.content])
                snapshot.appendItems([.body(bodyViewModel)])
            }

            return snapshot
        }.eraseToAnyPublisher()
    }

    var canSave: AnyPublisher<Bool, Never> {
        $tweet.combineLatest(bodyViewModel.$body) { tweet, newBody in
            guard let tweet = tweet else { return false }

            return tweet.status == .draft && tweet.body != newBody
        }.eraseToAnyPublisher()
    }

    var saveAction: BoundUserAction<Void>? {
        guard let existingTweet = tweet else { return nil }

        var tweet = existingTweet
        if let newBody = bodyViewModel.body {
            tweet.body = newBody
        }

        return tweet.saveAction.bind(to: actionRunner)
    }
}
