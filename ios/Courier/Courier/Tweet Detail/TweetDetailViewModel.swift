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

final class TweetDetailViewModel: ViewModel {
    enum Section {
        case content
    }

    enum Item: Hashable {
        case body(TweetBodyCellViewModel)
    }

    typealias Snapshot = NSDiffableDataSourceSnapshot<Section, Item>

    @Published var tweet: AllTweetsFields?

    var bodyViewModel = TweetBodyCellViewModel()

    init(tweet: AllTweetsFields? = nil, client: ApolloClient = .main) {
        self.tweet = tweet
        super.init(client: client)

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
}
