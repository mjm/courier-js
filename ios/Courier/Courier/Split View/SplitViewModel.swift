//
//  SplitViewModel.swift
//  Courier
//
//  Created by Matt Moriarity on 11/12/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Apollo
import Combinable
import UIKit

final class SplitViewModel: ViewModel {
    let masterViewModel: TweetsViewModel
    let detailViewModel: TweetDetailViewModel

    @Published var selection: AllTweetsFields?

    override init(client: ApolloClient = .main) {
        masterViewModel = TweetsViewModel(client: client)
        detailViewModel = TweetDetailViewModel(client: client)
        super.init(client: client)

        bindMaster()
        bindDetail()
    }

    private func bindMaster() {
        masterViewModel.$selection
            .map { $0?.tweet }
            .removeDuplicates { $0?.id == $1?.id }
            .assign(to: \.selection, on: self, weak: true)
            .store(in: &cancellables)

        $selection.combineLatest(masterViewModel.allTweetModels) { selection, tweetModels in
            selection.flatMap { tweet in tweetModels.first { $0.tweet.id == tweet.id } }
        }.assign(to: \.selection, on: masterViewModel).store(in: &cancellables)
    }

    private func bindDetail() {
        $selection.assign(to: \.tweet, on: detailViewModel).store(in: &cancellables)
    }
}
