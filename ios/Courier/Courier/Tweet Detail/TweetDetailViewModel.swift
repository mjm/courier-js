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
        case published
        case tweeted
    }

    enum Item: Hashable {
        case body(TweetBodyCellViewModel)
        case action(TweetActionCellViewModel)
        case timestamp(TweetTimestampCellViewModel, String)
    }

    typealias Snapshot = NSDiffableDataSourceSnapshot<Section, Item>

    @Published var tweetId: GraphQLID?
    @Published private(set) var tweet: AllTweetsFields?

    let bodyViewModel = TweetBodyCellViewModel()
    let postTimeViewModel = TweetTimestampCellViewModel(keyPath: \.post.publishedAt)
    var viewPostViewModel: TweetActionCellViewModel!
    let tweetTimeViewModel = TweetTimestampCellViewModel(keyPath: \.postedAt)
    var viewTweetViewModel: TweetActionCellViewModel!

    private var tweetSubscription: AnyCancellable?

    init(tweetId: GraphQLID? = nil, client: ApolloClient = .main) {
        self.tweetId = tweetId
        super.init(client: client)

        viewPostViewModel = TweetActionCellViewModel { [actionRunner] tweet in
            tweet.viewPostAction?.bind(to: actionRunner, title: NSLocalizedString("View Original Post", comment: ""))
        }

        viewTweetViewModel = TweetActionCellViewModel { [actionRunner] tweet in
            tweet.viewTweetAction?.bind(to: actionRunner, title: NSLocalizedString("View on Twitter", comment: ""))
        }

        $tweetId.removeDuplicates().sink { [weak self] tweetId in
            guard let self = self else { return }

            // clear out stale data
            self.tweet = nil

            guard let tweetId = tweetId else {
                return
            }

            self.tweetSubscription = self.apolloClient.publisher(query: GetTweetQuery(id: tweetId))
                .ignoreLoading()
                .ignoreError()
                .map { data in data.tweet?.fragments.allTweetsFields }
                .assign(to: \.tweet, on: self, weak: true)
        }.store(in: &cancellables)

        $tweet.assign(to: \.tweet, on: bodyViewModel).store(in: &cancellables)
        $tweet.assign(to: \.tweet, on: postTimeViewModel).store(in: &cancellables)
        $tweet.assign(to: \.tweet, on: viewPostViewModel).store(in: &cancellables)
        $tweet.assign(to: \.tweet, on: tweetTimeViewModel).store(in: &cancellables)
        $tweet.assign(to: \.tweet, on: viewTweetViewModel).store(in: &cancellables)
    }

    var status: AnyPublisher<TweetStatus?, Never> {
        $tweet.map { $0?.status }.eraseToAnyPublisher()
    }

    var snapshot: AnyPublisher<Snapshot, Never> {
        $tweet.combineLatest(bodyViewModel.$body) { [weak self] tweet, _ in
            var snapshot = Snapshot()
            guard let self = self else { return snapshot }

            if let tweet = tweet {
                snapshot.appendSections([.content])
                snapshot.appendItems([.body(self.bodyViewModel)])

                snapshot.appendSections([.published])
                snapshot.appendItems([
                    .timestamp(self.postTimeViewModel, NSLocalizedString("Published", comment: "")),
                    .action(self.viewPostViewModel)
                ])

                if !(tweet.postedTweetId?.isEmpty ?? true) {
                    snapshot.appendSections([.tweeted])
                    snapshot.appendItems([
                        .timestamp(self.tweetTimeViewModel, NSLocalizedString("Tweeted", comment: "")),
                        .action(self.viewTweetViewModel),
                    ])
                }
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
