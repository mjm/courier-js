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
        case timestamps
        case actions
    }

    enum Item: Hashable {
        case body(TweetBodyCellViewModel)
        case action(TweetActionCellViewModel)
        case timestamp(TweetTimestampCellViewModel, String)
    }

    typealias Snapshot = NSDiffableDataSourceSnapshot<Section, Item>

    @Published var tweetId: GraphQLID?
    @Published private(set) var tweetState: QueryState<AllTweetsFields?> = .loaded(nil)

    let bodyViewModel = TweetBodyCellViewModel()
    var autopostTimeViewModel: TweetTimestampCellViewModel!
    var postTimeViewModel: TweetTimestampCellViewModel!
    var tweetTimeViewModel: TweetTimestampCellViewModel!

    var cancelActionModel: TweetActionCellViewModel!
    var uncancelActionModel: TweetActionCellViewModel!
    var postActionModel: TweetActionCellViewModel!

    private var tweetSubscription: AnyCancellable?

    init(tweetId: GraphQLID? = nil, client: ApolloClient = .main) {
        self.tweetId = tweetId
        super.init(client: client)

        createChildViewModels()

        $tweetId.removeDuplicates().sink { [weak self] tweetId in
            guard let self = self else { return }

            guard let tweetId = tweetId else {
                self.tweetState = .loaded(nil)
                return
            }

            self.tweetSubscription = self.apolloClient.publisher(query: GetTweetQuery(id: tweetId))
                .queryMap { data in data.tweet?.fragments.allTweetsFields }
                .ignoreError()
                .assign(to: \.tweetState, on: self, weak: true)
        }.store(in: &cancellables)

        for model in allTweetViewModels {
            tweet.assign(to: \.tweet, on: model).store(in: &cancellables)
        }
    }

    private func createChildViewModels() {
        let runner = actionRunner

        autopostTimeViewModel = TweetTimestampCellViewModel(keyPath: \.postAfterDate)
        postTimeViewModel = TweetTimestampCellViewModel(keyPath: \.post.publishedAtDate) { tweet in
            tweet.viewPostAction?.bind(to: runner)
        }
        tweetTimeViewModel = TweetTimestampCellViewModel(keyPath: \.postedAtDate) { tweet in
            tweet.viewTweetAction?.bind(to: runner)
        }

        cancelActionModel = TweetActionCellViewModel { tweet in
            tweet.cancelAction.bind(to: runner)
        }
        uncancelActionModel = TweetActionCellViewModel { tweet in
            tweet.uncancelAction.bind(to: runner)
        }
        postActionModel = TweetActionCellViewModel { tweet in
            tweet.postAction.bind(to: runner)
        }
    }

    private var allTweetViewModels: [TweetViewModel] {
        [
            bodyViewModel,
            autopostTimeViewModel,
            postTimeViewModel,
            tweetTimeViewModel,
            cancelActionModel,
            uncancelActionModel,
            postActionModel,
        ]
    }

    var tweet: AnyPublisher<AllTweetsFields?, Never> {
        $tweetState.ignoreLoading()
    }

    var status: AnyPublisher<TweetStatus?, Never> {
        tweet.map { $0?.status }.eraseToAnyPublisher()
    }

    var draftBody: AnyPublisher<String?, Never> {
        bodyViewModel.$body.eraseToAnyPublisher()
    }

    var snapshot: AnyPublisher<Snapshot, Never> {
        $tweetState.map { [weak self] tweetState in
            var snapshot = Snapshot()
            guard let self = self, case .loaded(let tweet) = tweetState else { return snapshot }

            if let tweet = tweet {
                snapshot.appendSections([.content])
                snapshot.appendItems([.body(self.bodyViewModel)])

                snapshot.appendSections([.timestamps])

                if tweet.postAfter != nil {
                    snapshot.appendItems([.timestamp(self.autopostTimeViewModel, NSLocalizedString("Autoposting", comment: ""))])
                }

                snapshot.appendItems([.timestamp(self.postTimeViewModel, NSLocalizedString("Published", comment: ""))])

                if !(tweet.postedTweetId?.isEmpty ?? true) {
                    snapshot.appendItems([.timestamp(self.tweetTimeViewModel, NSLocalizedString("Tweeted", comment: ""))])
                }

                var actions = [Item]()
                if tweet.cancelAction.canPerform {
                    actions.append(.action(self.cancelActionModel))
                }
                if tweet.uncancelAction.canPerform {
                    actions.append(.action(self.uncancelActionModel))
                }
                if tweet.postAction.canPerform {
                    actions.append(.action(self.postActionModel))
                }

                if !actions.isEmpty {
                    snapshot.appendSections([.actions])
                    snapshot.appendItems(actions)
                }
            }

            return snapshot
        }.eraseToAnyPublisher()
    }

    var isLoading: AnyPublisher<Bool, Never> {
        $tweetState.map { $0.isLoading }.eraseToAnyPublisher()
    }

    var canSave: AnyPublisher<Bool, Never> {
        tweet.combineLatest(bodyViewModel.$body) { tweet, newBody in
            guard let tweet = tweet else { return false }

            return tweet.status == .draft && tweet.body != newBody
        }.eraseToAnyPublisher()
    }

    var saveAction: BoundUserAction<Void>? {
        guard case let .loaded(existingTweet?) = tweetState else { return nil }

        var tweet = existingTweet
        if let newBody = bodyViewModel.body {
            tweet.body = newBody
        }

        return tweet.saveAction.bind(to: actionRunner)
    }
}

protocol TweetViewModel: class {
    var tweet: AllTweetsFields? { get set }
}
