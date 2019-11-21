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
    enum Section: Int {
        case upcoming
        case past
    }

    typealias Item = TweetCellViewModel

    typealias Snapshot = NSDiffableDataSourceSnapshot<Section, Item>

    @Published private(set) var upcomingTweetViewModels: [Item] = []
    @Published private(set) var pastTweetViewModels: [Item] = []

    @Published var selectedSection: Section = .upcoming
    @Published var selection: Item?

    @Published var refreshingSections = Set<Section>()

    override init(client: ApolloClient = .main) {
        super.init(client: client)

        $upcomingTweetViewModels.applyingChanges(from: upcomingTweets, keyPath: \.tweet) { [actionRunner] tweet in
            Item(tweet: tweet, actionRunner: actionRunner)
        }.assign(to: \.upcomingTweetViewModels, on: self, weak: true).store(in: &cancellables)

        $pastTweetViewModels.applyingChanges(from: pastTweets, keyPath: \.tweet) { [actionRunner] tweet in
            Item(tweet: tweet, actionRunner: actionRunner)
        }.assign(to: \.pastTweetViewModels, on: self, weak: true).store(in: &cancellables)

        upcomingTweets.sink { [weak self] _ in
            self?.refreshingSections.remove(.upcoming)
        }.store(in: &cancellables)
        pastTweets.sink { [weak self] _ in
            self?.refreshingSections.remove(.past)
        }.store(in: &cancellables)
    }

    var snapshot: AnyPublisher<Snapshot, Never> {
        $selectedSection.combineLatest($upcomingTweetViewModels, $pastTweetViewModels) { section, upcoming, past in
            var snapshot = Snapshot()

            snapshot.appendSections([section])

            switch section {
            case .upcoming:
                snapshot.appendItems(upcoming, toSection: section)
            case .past:
                snapshot.appendItems(past, toSection: section)
            }

            return snapshot
        }.eraseToAnyPublisher()
    }

    var upcomingTweets: AnyPublisher<[AllTweetsFields], Never> {
        apolloClient.publisher(
            query: UpcomingTweetsQuery(),
            pollInterval: 60,
            refresh: startRefreshingSection(.upcoming)
        ).map { result in
            result.data?.allTweets.fragments.tweetConnectionFields.nodes.map { $0.fragments.allTweetsFields } ?? []
        }.ignoreError().eraseToAnyPublisher()
    }

    var pastTweets: AnyPublisher<[AllTweetsFields], Never> {
        apolloClient.publisher(
            query: PastTweetsQuery(),
            pollInterval: 60,
            refresh: startRefreshingSection(.past)
        ).map { result in
            result.data?.allTweets.fragments.tweetConnectionFields.nodes.map { $0.fragments.allTweetsFields } ?? []
        }.ignoreError().eraseToAnyPublisher()
    }

    var allTweetModels: AnyPublisher<[TweetCellViewModel], Never> {
        $upcomingTweetViewModels.combineLatest($pastTweetViewModels) { upcoming, past in
            upcoming + past
        }.eraseToAnyPublisher()
    }

    private func startRefreshingSection(_ section: Section) -> AnyPublisher<(), Never> {
        $refreshingSections
            .map { $0.contains(section) }
            .removeDuplicates()
            .filter { $0 }
            .map { _ in }
            .eraseToAnyPublisher()
    }

    var isRefreshingCurrentSection: AnyPublisher<Bool, Never> {
        $selectedSection.combineLatest($refreshingSections) { section, refreshingSections in
            refreshingSections.contains(section)
        }.removeDuplicates().eraseToAnyPublisher()
    }

    func refreshCurrentSection() {
        refreshingSections.insert(selectedSection)
    }

    func showSettings() {
        actionRunner.perform(ShowSettingsAction())
    }
}
