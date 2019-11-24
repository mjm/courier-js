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

    @Published var selection: GraphQLID?

    override init(client: ApolloClient = .main) {
        masterViewModel = TweetsViewModel(client: client)
        detailViewModel = TweetDetailViewModel(client: client)
        super.init(client: client)

        bindMaster()
        bindDetail()
    }

    private func bindMaster() {
        masterViewModel.$selection
            .removeDuplicates()
            .assign(to: \.selection, on: self, weak: true)
            .store(in: &cancellables)

        $selection
            .removeDuplicates()
            .assign(to: \.selection, on: masterViewModel)
            .store(in: &cancellables)
    }

    private func bindDetail() {
        $selection.assign(to: \.tweetId, on: detailViewModel).store(in: &cancellables)
    }
}
